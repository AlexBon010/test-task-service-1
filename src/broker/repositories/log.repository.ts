import { Injectable } from '@nestjs/common';
import { LogsService } from '../logs/logs/logs.service';
import { ILog } from '../interfaces/log.interface';

@Injectable()
export class LogRepository {
    private readonly LOG_TOPIC = 'logs';
    private readonly SERVICE_NAME = 'task-service-1';

    constructor(private readonly logsService: LogsService) { }

    info(message: string) {
        this.log('info', message);
    }

    warn(message: string) {
        this.log('warn', message);
    }

    error(message: string) {
        this.log('error', message);
    }


    private log(level: ILog['level'], message: string) {
        const logEntry: ILog = {
            level,
            message,
            timestamp: new Date().toISOString(),
            service: this.SERVICE_NAME,
        };

        this.logsService.postLogs(logEntry);
    }
}