import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class UploadedFile {
    @Prop({ required: true })
    originalFileName: string;

    @Prop({ required: true, enum: ['json', 'xlsx', 'xls'] })
    fileType: string;

    @Prop({ required: true, type: [Object], index: 'text' })
    records: Record<string, any>[];

    @Prop({ required: true })
    totalRecords: number;

    @Prop({ type: [String], index: true })
    fields: string[];
}

export type UploadedFileDocument = HydratedDocument<UploadedFile>;
const schema = SchemaFactory.createForClass(UploadedFile);

schema.index({ createdAt: -1, _id: -1 });

export const UploadedFileSchema = schema;