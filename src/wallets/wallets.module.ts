import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsController } from './controllers/wallets.controller';
import { WalletsService } from './services/wallets.service';
import { User as UserEntity } from 'src/users/user.entity';
import { Wallet as WalletEntity } from './wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, WalletEntity])],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
