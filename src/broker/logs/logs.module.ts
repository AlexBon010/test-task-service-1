import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { LogsService } from './logs/logs.service';
import { LogRepository } from '../repositories/log.repository';
import { ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
    imports: [

        ClientsModule.registerAsync([
            {
                name: 'LOGS_SERVICE',
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'logs-producer',
                            brokers: [`${configService.get<string>('KAFKA_HOST')}:${configService.get<number>('KAFKA_PORT_EXTERNAL')}`],
                        },
                        producer: {
                            allowAutoTopicCreation: true,
                        },
                    },
                }),
            },
        ]),
    ],
    providers: [LogsService, LogRepository, LoggerMiddleware],
    exports: [LoggerMiddleware, LogRepository],
})
export class LogsModule { }
