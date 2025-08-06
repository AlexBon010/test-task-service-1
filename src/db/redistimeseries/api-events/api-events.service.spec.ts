import { Test, TestingModule } from '@nestjs/testing';
import { ApiEventsService } from './api-events.service';

describe('ApiEventsService', () => {
  let service: ApiEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiEventsService],
    }).compile();

    service = module.get<ApiEventsService>(ApiEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
