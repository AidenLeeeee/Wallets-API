import { Injectable } from '@nestjs/common';
import { HistoryRepository } from '../repositories/history.repository';

@Injectable()
export class HistoriesService {
  constructor(private readonly historyRepository: HistoryRepository) {}

  // Get all histories
  async getAllHistories() {
    return await this.historyRepository.findAllWithUserTable();
  }
}
