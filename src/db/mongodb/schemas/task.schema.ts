import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'


@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    description: string

    @Prop({ default: false })
    isCompleted: boolean
}

export type TaskDocument = HydratedDocument<Task>
export const TaskSchema = SchemaFactory.createForClass(Task)