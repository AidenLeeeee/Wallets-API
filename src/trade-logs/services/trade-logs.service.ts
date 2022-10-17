import { Injectable } from '@nestjs/common';
import { TradeLogRepository } from '../repositories/trade-log.repository';

@Injectable()
export class TradeLogsService {
  constructor(private readonly tradeLogRepository: TradeLogRepository) {}

  // Find all trade logs
  async getAllTradeLogs() {
    return await this.tradeLogRepository.findAll();
  }
}
