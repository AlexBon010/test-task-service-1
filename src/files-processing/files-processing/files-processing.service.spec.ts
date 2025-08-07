import { Test, TestingModule } from '@nestjs/testing';
import { FilesProcessingService } from './files-processing.service';

describe('FilesProcessingService', () => {
  let service: FilesProcessingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesProcessingService],
    }).compile();

    service = module.get<FilesProcessingService>(FilesProcessingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
