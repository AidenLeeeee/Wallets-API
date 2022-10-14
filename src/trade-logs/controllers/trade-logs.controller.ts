import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TradeLogCreateDto } from '../dtos/trade-log.create.dto';
import { TradeLogsService } from '../services/trade-logs.service';

@Controller('trade-logs')
export class TradeLogsController {
  constructor(private readonly tradeLogsService: TradeLogsService) {}

  @ApiOperation({ summary: 'Get all trade logs.' })
  @Get()
  async getAllTradeLogs() {
    return await this.tradeLogsService.getAllTradeLogs();
  }

  @ApiOperation({ summary: 'Create a trade log automatically.' })
  @Post()
  async createTradeLog(@Body() tradeLogCreateDto: TradeLogCreateDto) {
    return await this.tradeLogsService.createTradeLog(tradeLogCreateDto);
  }
}
