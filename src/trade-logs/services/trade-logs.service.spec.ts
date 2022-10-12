import { Test, TestingModule } from '@nestjs/testing';
import { TradeLogsService } from './trade-logs.service';

describe('TradeLogsService', () => {
  let service: TradeLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradeLogsService],
    }).compile();

    service = module.get<TradeLogsService>(TradeLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
