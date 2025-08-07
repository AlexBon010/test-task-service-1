import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { LogsService } from './logs/logs.service';
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
                            clientId: configService.get<string>('KAFKA_LOGS_CLIENT'),
                            brokers: [`${configService.get<string>('KAFKA_HOST')}:${configService.get<number>('KAFKA_PORT')}`],
                        },
                        producer: {
                            allowAutoTopicCreation: true,
                            idempotent: false,
                            maxInFlightRequests: 1,
                            retries: 0,
                            acks: 0,
                        },
                    },
                }),
            },
        ]),
    ],
    providers: [LogsService, LoggerMiddleware],
    exports: [LoggerMiddleware, LogsService],
})
export class LogsModule { }
