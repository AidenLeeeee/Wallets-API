import { Test, TestingModule } from '@nestjs/testing';
import { TradeLogsController } from './trade-logs.controller';

describe('TradeLogsController', () => {
  let controller: TradeLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradeLogsController],
    }).compile();

    controller = module.get<TradeLogsController>(TradeLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
