import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity } from 'src/users/user.entity';
import { TradeLogsController } from './controllers/trade-logs.controller';
import { TradeLogsService } from './services/trade-logs.service';
import { TradeLog as TradeLogEntity } from './trade-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TradeLogEntity, UserEntity])],
  controllers: [TradeLogsController],
  providers: [TradeLogsService],
  exports: [TradeLogsService],
})
export class TradeLogsModule {}
