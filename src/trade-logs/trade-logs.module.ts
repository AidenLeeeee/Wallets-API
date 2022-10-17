import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeLogsController } from './controllers/trade-logs.controller';
import { TradeLogRepository } from './repositories/trade-log.repository';
import { TradeLogsService } from './services/trade-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([TradeLogRepository])],
  controllers: [TradeLogsController],
  providers: [TradeLogsService],
})
export class TradeLogsModule {}
