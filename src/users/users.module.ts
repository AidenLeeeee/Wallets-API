import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryRepository } from 'src/histories/repositories/history.repository';
import { TradeLogRepository } from 'src/trade-logs/repositories/trade-log.repository';
import { WalletRepository } from 'src/wallets/repositories/wallet.repository';
import { UsersController } from './controllers/users.controller';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      WalletRepository,
      TradeLogRepository,
      HistoryRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
