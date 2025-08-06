import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class ApiEventsService {
    private readonly logger = new Logger(ApiEventsService.name);
    private readonly retention = 30 * 24 * 60 * 60 * 1000;

    constructor(@InjectRedis() private readonly redis: Redis) { }

    async recordResponseTime(endpoint: string, method: string, value: number, timestamp = Date.now()) {
        const key = `metrics:${method}:${endpoint}:response_time`;
        console.log(key)
        await this.addPoint(key, timestamp, value, {
            endpoint,
            method,
            metric: 'response_time',
        });
    }


    async recordError(endpoint: string, method: string, timestamp = Date.now()) {
        const key = `metrics:${method}:${endpoint}:error_count`;
        await this.addPoint(key, timestamp, 1, {
            endpoint,
            method,
            metric: 'error_count',
        });
    }

    async recordSuccessRate(endpoint: string, method: string, rate: number, timestamp = Date.now()) {
        const key = `metrics:${method}:${endpoint}:success_rate`;
        await this.addPoint(key, timestamp, rate, {
            endpoint,
            method,
            metric: 'success_rate',
        });
    }

    private async addPoint(key: string, timestamp: number, value: number, labels: Record<string, string>) {
        try {

            await this.redis.call(
                'TS.ADD',
                key,
                timestamp.toString(),
                value.toString(),
                'RETENTION',
                this.retention.toString(),
                'LABELS',
                ...Object.entries(labels).flatMap(([k, v]) => [k, v])
            );
        } catch (error) {
            this.logger.error(`Error adding point to ${key}: ${error.message}`, error.stack);
        }
    }

}
