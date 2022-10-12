import { Module } from '@nestjs/common';
import { TradeLogsController } from './trade-logs.controller';
import { TradeLogsService } from './trade-logs.service';

@Module({
  controllers: [TradeLogsController],
  providers: [TradeLogsService]
})
export class TradeLogsModule {}
