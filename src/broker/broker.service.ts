import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class BrokerService implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject("KAFKA_SERVICE")
        private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf("logs")
        await this.kafkaClient.connect()
    }

    async onModuleDestroy() {
        await this.kafkaClient.close()
    }

    emit(topic: string, message: unknown) {
        return this.kafkaClient.emit(topic, message)
    }
}