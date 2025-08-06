import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    UploadedFile,
    UploadedFileDocument,
    RecordEntity,
    RecordEntityDocument
} from '../schemas/uploaded-file.schema';
import { GetDocRequestDto, GetDocResponseDto } from 'src/files-processing/dto/get-doc.dto';

@Injectable()
export class UploadedFileService {
    constructor(
        @InjectModel(UploadedFile.name) private uploadedFileModel: Model<UploadedFileDocument>,
        @InjectModel(RecordEntity.name) private recordEntityModel: Model<RecordEntityDocument>,
    ) { }


    async createParentDocument(data: UploadedFile): Promise<string> {
        const createdFile = new this.uploadedFileModel(data);
        const savedFile = await createdFile.save();
        return savedFile._id.toString();
    }


    async createRecordsBatch(
        parentId: string,
        records: Record<string, unknown>[]
    ): Promise<void> {
        if (!records.length) return;

        const batchSize = 50000;

        for (let start = 0; start < records.length; start += batchSize) {
            const batch = records.slice(start, start + batchSize);

            const recordEntities = batch.map(record => ({
                uploadedFileId: parentId,
                data: record
            }));

            await this.recordEntityModel.insertMany(recordEntities, {
                ordered: false,
                rawResult: false
            });
        }
    }



    private parseFilterString(filterStr?: string): Record<string, any> {
        if (!filterStr) return {};

        const operatorsMap: Record<string, string> = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte',
            '=': ''
        };

        const conditions = filterStr.split(',').map((condition) => {
            const [, field, operator, value] = condition.match(/([^><!=]+)([><]=?|=)(.+)/) || [];
            if (!field || !operator || !value) return null;

            const fieldPath = `data.${field.trim()}`;
            const parsedValue = isNaN(Number(value.trim())) ? value.trim() : Number(value.trim());

            return operatorsMap[operator]
                ? { [fieldPath]: { [operatorsMap[operator]]: parsedValue } }
                : { [fieldPath]: parsedValue };
        }).filter(Boolean);

        return { $and: conditions }
    }


    async getRecordsByParentId(
        {
            parentId,
            page,
            docsPerPage,
            limit = 100,
            filter
        }: GetDocRequestDto & { parentId: string }
    ): Promise<GetDocResponseDto[]> {
        const filterQuery = this.parseFilterString(filter);

        const query = {
            uploadedFileId: parentId,
            ...filterQuery
        };

        let findQuery = this.recordEntityModel
            .find(query)
            .select('data')
            .select('data -_id')
            .lean();

        if (page && docsPerPage) {
            const skip = (page - 1) * docsPerPage;
            findQuery = findQuery
                .skip(skip)
                .limit(Math.min(docsPerPage, limit));
        } else {
            findQuery = findQuery.limit(limit);
        }

        const data = await findQuery.exec();

        return data.map(doc => doc.data)

    }

}