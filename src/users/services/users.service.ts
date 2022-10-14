import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradeLogCreateDto } from 'src/trade-logs/dtos/trade-log.create.dto';
import { Repository } from 'typeorm';
import { UserChargeDto } from '../dtos/user.charge.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserSendCashDto } from '../dtos/user.send.dto';
import { User as UserEntity } from '../user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    // Join 된 결과를 리턴
    const allUsers = await this.usersRepository.find({ relations: ['wallet'] });
    return allUsers;
  }

  async registerUser(userRegisterDto: UserRegisterDto) {
    const { email, phone } = userRegisterDto;
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .orWhere('user.phone = :phone', { phone })
      .getOne();

    if (user) {
      throw new UnauthorizedException('Your Account already exists.');
    }

    const newUser = await this.usersRepository.save(userRegisterDto);
    return newUser;
  }

  async chargeCash(id: number, userChargeDto: UserChargeDto) {
    const { cashAmountToCharge } = userChargeDto;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .where('user.id = :id', { id })
      .getOne();

    // user 존재하는지 확인 (추후 로그인으로 대체)
    if (!user) {
      throw new UnauthorizedException('No user matches.');
    }
    // user 에게 등록된 wallet 이 존재하는지 확인
    if (!user.wallet) {
      throw new BadRequestException('Please register new wallet first.');
    }

    const newCashAmount = user.wallet.cashAmount + cashAmountToCharge;
    user.wallet.cashAmount = newCashAmount;
    const newUser = await this.usersRepository.save(user);

    return newUser;
  }

  async sendCash(id: number, userSendCashDto: UserSendCashDto) {
    const { targetId, cashAmountToSend } = userSendCashDto;
    // user 존재하는지 확인 (추후 로그인으로 대체)
    // user 에게 등록된 wallet 이 있는지 확인
    const user = await this.usersRepository.findOne({
      relations: ['wallet'],
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException('No User exists.');
    }

    if (!user.wallet) {
      throw new BadRequestException('Please register new wallet first.');
    }

    // target user 가 존재하는지 확인
    // target user 에게 등록된 wallet 이 있는지 확인
    const targetUser = await this.usersRepository.findOne({
      relations: ['wallet'],
      where: { id: targetId },
    });

    if (!targetUser) {
      throw new NotFoundException('No target user exists.');
    }

    if (!targetUser.wallet) {
      throw new BadRequestException(
        "Target user doesn't have a registered wallet.",
      );
    }

    // user 가 충분한 CashAmount 를 보유하고 있는지 확인
    if (user.wallet.cashAmount < cashAmountToSend) {
      throw new BadRequestException("You don't have enough cash to send.");
    }

    // user wallet 에서 출금
    const userCashLeft = user.wallet.cashAmount - cashAmountToSend;
    user.wallet.cashAmount = userCashLeft;
    const updatedUser = await this.usersRepository.save(user);

    // target user wallet 에 입금
    const targetUserCashLeft = targetUser.wallet.cashAmount + cashAmountToSend;
    targetUser.wallet.cashAmount = targetUserCashLeft;
    const updatedTargetUser = await this.usersRepository.save(targetUser);

    return {
      user: updatedUser,
      targetUser: updatedTargetUser,
      cashAmount: cashAmountToSend,
    };
  }

  async getCash(id: number) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .where('user.id = :id', { id })
      .getOne();

    // user 존재하는지 확인 (추후 로그인 대체)
    if (!user) {
      throw new UnauthorizedException('No user exists.');
    }
    // user 에게 등록된 wallet 이 존재하는지 확인
    if (!user.wallet) {
      throw new BadRequestException('Please register wallet first.');
    }

    return {
      cashAmount: user.wallet.cashAmount,
    };
  }
}
