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

                const host = configService.get<string>('MONGODB_HOST')!
                const port = configService.get<number>('MONGODB_PORT')!

                const uri = `mongodb://${host}:${port}`
                return {
                    uri,
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
