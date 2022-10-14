import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TradeLogCreateDto } from 'src/trade-logs/dtos/trade-log.create.dto';
import { TradeLogsService } from 'src/trade-logs/services/trade-logs.service';
import { UserChargeDto } from 'src/users/dtos/user.charge.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserSendCashDto } from '../dtos/user.send.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tradeLogsService: TradeLogsService,
  ) {}

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
    const { user, targetUser, cashAmount } = await this.usersService.sendCash(
      id,
      userSendCashDto,
    );

    // TradeLogCreateDto 객체 생성
    const tradeLogCreateDto: TradeLogCreateDto = {
      senderId: user.id,
      receiverId: targetUser.id,
      cashAmount,
    };
    const tradeLogResult = await this.tradeLogsService.createTradeLog(
      tradeLogCreateDto,
    );
    return {
      sender: user,
      receiver: targetUser,
      tradeLog: tradeLogResult,
    };
  }

  @ApiOperation({ summary: 'Get cash amount' })
  @Get(':id/cash')
  async getCash(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getCash(id);
  }
}
