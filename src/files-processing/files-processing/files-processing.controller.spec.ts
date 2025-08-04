import { Test, TestingModule } from '@nestjs/testing';
import { FilesProcessingController } from './files-processing.controller';

describe('FilesProcessingController', () => {
  let controller: FilesProcessingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesProcessingController],
    }).compile();

    controller = module.get<FilesProcessingController>(FilesProcessingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
