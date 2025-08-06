import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { LogsService } from '../logs/logs.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logsService: LogsService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;

        res.on('finish', () => {
            const status = res.statusCode;
            const message = `${method} ${originalUrl}`;

            if (status >= 500) {
                this.logsService.error(message);
                next();
            }
            if (status >= 400) {
                this.logsService.warn(message);
                next();
            }
            this.logsService.info(message);
            next();
        });

        next();
    }
}
