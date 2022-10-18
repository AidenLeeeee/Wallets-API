import { EntityRepository, Repository } from 'typeorm';
import { TradeLogCreateDto } from '../dtos/trade-log.create.dto';
import { TradeLog as TradeLogEntity } from '../trade-log.entity';

@EntityRepository(TradeLogEntity)
export class TradeLogRepository extends Repository<TradeLogEntity> {
  // Find all trade logs
  async findAll() {
    return await this.find();
  }

  // Find all trade logs by user id
  async findAllByUserId(id: number) {
    return await this.find({
      where: [{ senderId: id }, { receiverId: id }],
      order: { createdAt: 'DESC' },
    });
  }

  // Create a trade log
  async createAndSave(tradeLogCreateDto: TradeLogCreateDto) {
    return await this.save(tradeLogCreateDto);
  }
}
