import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ILog } from 'src/broker/interfaces/log.interface';

@Injectable()
export class ApiEventsService {
    constructor(
        @InjectRedis() private readonly redis: Redis
    ) { }

    async log(level: ILog['level'], message: string): Promise<void> {
        const timestamp = Date.now();
        const logEntry: ILog = {
            level,
            message,
            timestamp: new Date(timestamp).toISOString(),
            service: 'task-service-1',
        };

        const keyBase = `logs:${logEntry.service}:${logEntry.level}`;

        await this.redis.call(
            'TS.ADD',
            keyBase,
            String(timestamp),
            '1',
            'LABELS',
            'level', logEntry.level,
            'service', logEntry.service,
            'message', logEntry.message
        );
    }

    async info(message: string): Promise<void> {
        await this.log('info', message);
    }

    async warn(message: string): Promise<void> {
        await this.log('warn', message);
    }

    async error(message: string): Promise<void> {
        await this.log('error', message);
    }
}
