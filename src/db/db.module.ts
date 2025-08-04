import { Module } from '@nestjs/common';
import { MongodbModule } from './mongodb';
import { RedistimeseriesModule } from './redistimeseries/redistimeseries.module';

@Module({
  imports: [MongodbModule, RedistimeseriesModule]
})
export class DbModule { }
