import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import {
    UploadedFile,
    UploadedFileSchema,
    RecordEntity,
    RecordEntitySchema
} from './schemas/uploaded-file.schema'
import { UploadedFileService } from './services/uploaded-file.service'

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
                    uri: `mongodb://localhost:27017`,
                    autoIndex: configService.get<string>('APP_MODE') === 'development',
                }
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: UploadedFile.name, schema: UploadedFileSchema },
            { name: RecordEntity.name, schema: RecordEntitySchema },
        ]),
    ],
    providers: [UploadedFileService],
    exports: [UploadedFileService],
})
export class MongodbModule { }
