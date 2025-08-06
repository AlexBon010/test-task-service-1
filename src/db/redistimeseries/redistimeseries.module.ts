import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis'
import { ConfigService } from '@nestjs/config';
import { ApiEventsService } from './api-events/api-events.service';
import { MetricsMiddleware } from './api-events/middleware/metrics.middleware';

@Module({
    imports: [
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const host = configService.get<string>('REDIS_HOST')!
                const port = configService.get<number>('REDIS_PORT_EXTERNAL')!
                const username = configService.get<string>('REDIS_USERNAME')!
                const password = configService.get<string>('REDIS_PASSWORD')!

                const url = `redis://${username}:${password}@${host}:${port}`

                return {
                    url,
                    type: 'single',
                }
            },
            inject: [ConfigService],
        }),
    ],
    providers: [ApiEventsService, MetricsMiddleware],
    exports: [ApiEventsService, MetricsMiddleware],
})
export class RedistimeseriesModule { }
