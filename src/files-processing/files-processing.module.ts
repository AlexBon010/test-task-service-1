import { Module } from '@nestjs/common';
import { FilesProcessingController } from './files-processing/files-processing.controller';
import { FilesProcessingService } from './files-processing/files-processing.service';

@Module({
  controllers: [FilesProcessingController],
  providers: [FilesProcessingService]
})
export class FilesProcessingModule {}
