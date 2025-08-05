import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class LogsService implements OnModuleInit {
    constructor(
        @Inject('LOGS_SERVICE')
        private readonly client: ClientKafka
    ) { }
    async onModuleInit() {
        await this.client.connect();
    }

    postLogs(data: any) {
        this.client.emit('logs', data)
    }
}
