import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsController } from './controllers/wallets.controller';
import { WalletsService } from './services/wallets.service';
import { WalletRepository } from './repositories/wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WalletRepository])],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
