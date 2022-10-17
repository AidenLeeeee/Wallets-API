import { EntityRepository, Repository } from 'typeorm';
import { HistoryRegisterDto } from '../dtos/history.register.dto';
import { History as HistoryEntity } from '../history.entity';

@EntityRepository(HistoryEntity)
export class HistoryRepository extends Repository<HistoryEntity> {
  // Find all histories with user table
  async findAllWithUserTable() {
    return await this.find({
      relations: ['user'],
    });
  }

  // Create a history
  async createAndSave(historyRegisterDto: HistoryRegisterDto) {
    return await this.save(historyRegisterDto);
  }
}
