import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UploadedFile, UploadedFileDocument } from '../schemas/uploaded-file.schema';

@Injectable()
export class UploadedFileService {
    constructor(
        @InjectModel(UploadedFile.name) public uploadedFileModel: Model<UploadedFileDocument>,
    ) { }

    async create(data: UploadedFile): Promise<string> {
        const createdFile = new this.uploadedFileModel(data);
        const savedFile = await createdFile.save();
        return savedFile._id.toString();
    }
    async addRecord(id: string, record: any) {
        const file = await this.uploadedFileModel.findById(id);
        if (!file) {
            throw new Error('File not found');
        }
        file.records = file.records.concat(record);
        await file.save();
        return file;
    }
    // async insertMany(data: UploadedFile[]) {
    //     const createdFile = new this.uploadedFileModel(data);
    //     const savedFile = await createdFile.save();
    //     return savedFile._id.toString();
    // }
}