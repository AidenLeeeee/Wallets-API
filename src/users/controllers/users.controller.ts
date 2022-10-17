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
import { UserWithdrawDto } from '../dtos/user.withdraw.dto';
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

  @ApiOperation({ summary: 'Withdraw cash' })
  @Post(':id/withdraw')
  async withdrawCash(
    @Param('id', ParseIntPipe) id: number,
    @Body() userWithdrawDto: UserWithdrawDto,
  ) {
    return await this.usersService.withdrawCash(id, userWithdrawDto);
  }

  @ApiOperation({ summary: 'Send cash' })
  @Post(':id/send')
  async sendCash(
    @Param('id', ParseIntPipe) id: number,
    @Body() userSendCashDto: UserSendCashDto,
  ) {
    const { sender, receiver, tradeLog } = await this.usersService.sendCash(
      id,
      userSendCashDto,
    );

    return {
      sender: sender,
      receiver: receiver,
      tradeLog: tradeLog,
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

  @ApiOperation({ summary: 'Get history' })
  @Get(':id/history')
  async getHistory(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getHistory(id);
  }

  @ApiOperation({ summary: 'Get deposit history' })
  @Get(':id/history/deposit')
  async getDepositHistory(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getDepositHistory(id);
  }

  @ApiOperation({ summary: 'Get withdrawal history' })
  @Get(':id/history/withdrawal')
  async getWithdrawalHistory(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getWithdrawalHistory(id);
  }

  @ApiOperation({ summary: 'Create and register wallet' })
  @Post(':id/wallets')
  async createAndRegisterWallet(
    @Param('id', ParseIntPipe) id: number,
    @Body() walletRegisterDto: WalletRegisterDto,
  ) {
    return await this.usersService.createAndRegisterWallet(
      id,
      walletRegisterDto,
    );
  }
}
