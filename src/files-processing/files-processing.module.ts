import { Module } from '@nestjs/common';
import { FilesProcessingController } from './files-processing/files-processing.controller';
import { FilesProcessingService } from './files-processing/files-processing.service';
import { MongodbModule } from '@db';


@Module({
  imports: [MongodbModule],
  controllers: [FilesProcessingController],
  providers: [FilesProcessingService]
})
export class FilesProcessingModule { }
