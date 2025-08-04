import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { Task, TaskSchema } from './schemas/task.schema'
import { TaskService } from './services/task.service'

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => {

                const username = configService.get<string>('MONGO_INITDB_ROOT_USERNAME')!
                const password = configService.get<string>('MONGO_INITDB_ROOT_PASSWORD')!
                const host = configService.get<string>('MONGO_HOST')!
                const port = configService.get<number>('MONGODB_PORT_EXTERNAL')!

                const uri = `mongodb://${username}:${password}@${host}:${port}`

                return {
                    uri,
                    autoIndex: configService.get<string>('APP_MODE') === 'development',
                }
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Task.name, schema: TaskSchema },
        ]),
    ],
    providers: [TaskService],
    exports: [TaskService],
})
export class MongodbModule { }
