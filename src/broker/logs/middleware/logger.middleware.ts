import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogRepository } from '../../repositories/log.repository';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logRepository: LogRepository) { }

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;

        res.on('finish', () => {
            const status = res.statusCode;
            const message = `${method} ${originalUrl}`;

            if (status >= 500) {
                this.logRepository.error(message);
                next();
            }
            if (status >= 400) {
                this.logRepository.warn(message);
                next();
            }
            this.logRepository.info(message);
            next();
        });

        next();
    }
}
