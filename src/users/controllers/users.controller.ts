import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserChargeDto } from 'src/users/dtos/user.charge.dto';
import { WalletRegisterDto } from 'src/wallets/dtos/wallet.register.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserSendCashDto } from '../dtos/user.send.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Create a user' })
  @Post()
  async registerUser(@Body() userRegisterDto: UserRegisterDto) {
    return await this.usersService.registerUser(userRegisterDto);
  }

  @ApiOperation({ summary: 'Charge cash' })
  @Post(':id/charge')
  async chargeCash(
    @Param('id', ParseIntPipe) id: number,
    @Body() userChargeDto: UserChargeDto,
  ) {
    return await this.usersService.chargeCash(id, userChargeDto);
  }

  @ApiOperation({ summary: 'Send cash' })
  @Post(':id/send')
  async sendCash(
    @Param('id', ParseIntPipe) id: number,
    @Body() userSendCashDto: UserSendCashDto,
  ) {
    const { user, targetUser, tradeLogResult } =
      await this.usersService.sendCash(id, userSendCashDto);

    return {
      sender: user,
      receiver: targetUser,
      tradeLog: tradeLogResult,
    };
  }

  @ApiOperation({ summary: 'Get cash amount' })
  @Get(':id/cash')
  async getCash(@Param('id', ParseIntPipe) id: number) {
    const cashAmount = await this.usersService.getCash(id);
    return {
      cashAmount,
    };
  }

  @ApiOperation({ summary: 'Create and register wallet' })
  @Post(':id/wallets')
  async registerWallet(
    @Param('id', ParseIntPipe) id: number,
    @Body() walletRegisterDto: WalletRegisterDto,
  ) {
    return await this.usersService.registerWallet(id, walletRegisterDto);
  }
}
