import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriesController } from './controllers/histories.controller';
import { HistoryRepository } from './repositories/history.repository';
import { HistoriesService } from './services/histories.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryRepository])],
  controllers: [HistoriesController],
  providers: [HistoriesService],
})
export class HistoriesModule {}
