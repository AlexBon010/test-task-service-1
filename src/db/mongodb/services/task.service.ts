import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Task, TaskDocument } from '../schemas/task.schema'

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name)
        private readonly taskModel: Model<TaskDocument>,
    ) { }

    async create(data: Partial<Task>): Promise<Task> {
        const task = new this.taskModel(data)
        return task.save()
    }

    async findAll(): Promise<Task[]> {
        return this.taskModel.find().exec()
    }

    async findOne(id: string): Promise<Task | null> {
        return this.taskModel.findById(id).exec()
    }

    async update(id: string, data: Partial<Task>): Promise<Task | null> {
        return this.taskModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec()
    }

    async delete(id: string): Promise<Task | null> {
        return this.taskModel.findByIdAndDelete(id).exec()
    }
}