import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HistoriesService } from '../services/histories.service';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @ApiOperation({ summary: 'Get all histories' })
  @Get()
  async getAllHistories() {
    return await this.historiesService.getAllHistories();
  }
}
