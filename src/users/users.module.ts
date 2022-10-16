import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeLogsModule } from 'src/trade-logs/trade-logs.module';
import { WalletRepository } from 'src/wallets/repositories/wallet.repository';
import { UsersController } from './controllers/users.controller';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, WalletRepository]),
    TradeLogsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
