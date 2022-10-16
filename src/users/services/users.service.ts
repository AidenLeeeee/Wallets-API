import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserChargeDto } from '../dtos/user.charge.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserSendCashDto } from '../dtos/user.send.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  // Find all users
  async getAllUsers() {
    return await this.userRepository.findAllWithJoinTable();
  }

  // Create a user
  async registerUser(userRegisterDto: UserRegisterDto) {
    const user = await this.userRepository.findOneByPhoneOrEmail(
      userRegisterDto.phone,
      userRegisterDto.email,
    );
    if (user) throw new UnauthorizedException('Your Account already exists.');
    return await this.userRepository.createAndSave(userRegisterDto);
  }

  // Charge cash
  async chargeCash(id: number, userChargeDto: UserChargeDto) {
    const user = await this.userRepository.findOneByIdWithJoinTable(id);
    this.userRepository.checkUserAndWalletExistOrThrow(user);
    return await this.userRepository.chargeCash(user, userChargeDto);
  }

  // Send cash
  async sendCash(id: number, userSendCashDto: UserSendCashDto) {
    const { targetId, cashAmountToSend } = userSendCashDto;

    // user, targetUser 존재하는지 확인 (추후 로그인으로 대체)
    // user, targetUser 에게 등록된 wallet 이 있는지 확인
    const user = await this.userRepository.findOneByIdWithJoinTable(id);
    this.userRepository.checkUserAndWalletExistOrThrow(user);
    const targetUser = await this.userRepository.findOneByIdWithJoinTable(
      targetId,
    );
    this.userRepository.checkUserAndWalletExistOrThrow(targetUser);

    // user 가 충분한 CashAmount 를 보유하고 있는지 확인
    this.userRepository.checkUserHasEnoughCashOrThrow(user, cashAmountToSend);

    return await this.userRepository.sendCash(
      user,
      targetUser,
      cashAmountToSend,
    );
  }

  // Get cash
  async getCash(id: number) {
    const user = await this.userRepository.findOneByIdWithJoinTable(id);
    // user 존재하는지 확인 (추후 로그인 대체)
    // user 에게 등록된 wallet 이 존재하는지 확인
    this.userRepository.checkUserAndWalletExistOrThrow(user);
    return user.wallet.cashAmount;
  }
}
