import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { resolve } from 'path'

import { validate } from './env.validation'

@Module({
    imports: [
        ConfigModule.forRoot({
            validate,
            isGlobal: true,
            envFilePath: [resolve(__dirname, '..', '..', '.env.development'), resolve(__dirname, '..', '..', '.env.production')],
        }),
    ],
})
export class CfgModule { }