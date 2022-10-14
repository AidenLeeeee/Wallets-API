import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { TradeLogCreateDto } from '../dtos/trade-log.create.dto';
import { TradeLog as TradeLogEntity } from '../trade-log.entity';

@Injectable()
export class TradeLogsService {
  constructor(
    @InjectRepository(TradeLogEntity)
    private readonly tradeLogsRepository: Repository<TradeLogEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getAllTradeLogs() {
    const allTradeLogs = await this.tradeLogsRepository.find();
    return allTradeLogs;
  }

  async createTradeLog(tradeLogCreateDto: TradeLogCreateDto) {
    const newTradeLog = await this.tradeLogsRepository.save(tradeLogCreateDto);
    return newTradeLog;
  }
}
