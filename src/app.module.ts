import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios';

import { CfgModule } from './cfg/cfg.module'
import { DbModule, MetricsMiddleware, RedistimeseriesModule } from '@db';
import { LoggerMiddleware, LogsModule } from './broker';
import { FilesProcessingModule } from './files-processing/files-processing.module';

@Module({
  imports: [CfgModule, DbModule, RedistimeseriesModule, LogsModule, HttpModule.register({
    global: true,
  }), FilesProcessingModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, MetricsMiddleware)
      .forRoutes('*');
  }
}
