import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeLogsModule } from 'src/trade-logs/trade-logs.module';
import { UsersController } from './controllers/users.controller';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), TradeLogsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
