import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiEventsService } from '../api-events.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
    constructor(private readonly apiEventsService: ApiEventsService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const startTime = Date.now();

        res.on('finish', () => {
            const responseTime = Date.now() - startTime;
            const status = res.statusCode;
            const message = `${method} ${originalUrl} - ${status} (${responseTime}ms)`;

            if (status >= 500) {
                this.apiEventsService.log('error', message);
                next();
            }

            if (status >= 400) {
                this.apiEventsService.log('warn', message);
                next();
            }

            this.apiEventsService.log('info', message);
            next();
        });

        next();
    }
}
