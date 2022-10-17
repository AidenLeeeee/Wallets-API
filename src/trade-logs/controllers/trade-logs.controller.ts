import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TradeLogsService } from '../services/trade-logs.service';

@Controller('trade-logs')
export class TradeLogsController {
  constructor(private readonly tradeLogsService: TradeLogsService) {}

  @ApiOperation({ summary: 'Get all trade logs.' })
  @Get()
  async getAllTradeLogs() {
    return await this.tradeLogsService.getAllTradeLogs();
  }
}
