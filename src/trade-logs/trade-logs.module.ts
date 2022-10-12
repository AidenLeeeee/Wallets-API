import { Module } from '@nestjs/common';
import { TradeLogsController } from './controllers/trade-logs.controller';
import { TradeLogsService } from './services/trade-logs.service';

@Module({
  controllers: [TradeLogsController],
  providers: [TradeLogsService],
})
export class TradeLogsModule {}
