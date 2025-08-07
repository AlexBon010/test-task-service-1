import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiEventsService } from '../api-events.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
    constructor(private readonly metrics: ApiEventsService) { }

    use(req: Request, res: Response, next: NextFunction): void {
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            const { method, originalUrl } = req;
            const statusCode = res.statusCode;

            const preparedUrl = originalUrl.split('?')[0]

            void this.metrics.recordResponseTime(preparedUrl, method, duration)

            if (statusCode >= 500) {
                void this.metrics.recordError(preparedUrl, method)
            }

            const isSuccess = statusCode < 400;
            void this.metrics.recordSuccessRate(preparedUrl, method, isSuccess ? 100 : 0)
        });

        next();
    }
}
