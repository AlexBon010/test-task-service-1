import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios';

import { CfgModule } from './cfg/cfg.module'
import { DbModule } from '@db';
import { BrokerModule } from './broker';
import { FilesProcessingModule } from './files-processing/files-processing.module';

@Module({
  imports: [CfgModule, DbModule, BrokerModule, HttpModule.register({
    global: true,
  }), FilesProcessingModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
