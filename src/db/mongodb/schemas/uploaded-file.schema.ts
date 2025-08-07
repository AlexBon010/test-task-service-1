import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class UploadedFile {
    @Prop({ required: true })
    originalFileName: string;

    @Prop({ required: true, enum: ['json', 'xlsx', 'xls'] })
    fileType: string;

    // @Prop({ type: [String], index: true })
    // fields: string[];
}

export type UploadedFileDocument = HydratedDocument<UploadedFile>;
export const UploadedFileSchema = SchemaFactory.createForClass(UploadedFile);

@Schema({ timestamps: true })
export class RecordEntity {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UploadedFile', required: true, index: true })
    uploadedFileId: mongoose.Types.ObjectId;

    @Prop({ type: Map, of: mongoose.Schema.Types.Mixed, required: true })
    data: { type: mongoose.Schema.Types.Mixed };
}

export type RecordEntityDocument = HydratedDocument<RecordEntity>;
export const RecordEntitySchema = SchemaFactory.createForClass(RecordEntity);

