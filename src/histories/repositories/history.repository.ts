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

  // Find a history without types
  async findAllHistoryByUserId(id: number) {
    return await this.find({
      relations: ['user'],
      where: { user: id },
      order: { createdAt: 'DESC' },
    });
  }

  // Find a history filtered by types
  async findAllHistoryByUserIdWithTypes(id: number, types: string) {
    return await this.find({
      relations: ['user'],
      where: { user: id, types: types },
      order: { createdAt: 'DESC' },
    });
  }

  // Create a history
  async createAndSave(historyRegisterDto: HistoryRegisterDto) {
    return await this.save(historyRegisterDto);
  }
}
