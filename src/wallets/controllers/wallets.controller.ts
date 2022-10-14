import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { WalletRegisterDto } from '../dtos/wallet.register.dto';
import { WalletsService } from '../services/wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @ApiOperation({ summary: 'Get all wallets' })
  @Get()
  async getAllWallets() {
    return await this.walletsService.getAllWallets();
  }

  @ApiOperation({ summary: 'Create a wallet' })
  @Post()
  async createWallet(@Body() walletRegisterDto: WalletRegisterDto) {
    return await this.walletsService.registerWallet(walletRegisterDto);
  }
}
