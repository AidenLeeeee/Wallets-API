import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet as WalletEntity } from 'src/wallets/wallet.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User as UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, WalletEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
