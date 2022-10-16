import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Wallet as WalletEntity } from 'src/wallets/wallet.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserChargeDto } from '../dtos/user.charge.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { User as UserEntity } from '../user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  // Find all users with join table
  async findAllWithJoinTable() {
    return await this.find({ relations: ['wallet'] });
  }

  // Find a user by Id with join table
  async findOneByIdWithJoinTable(id: number) {
    const user = await this.findOne({
      relations: ['wallet'],
      where: { id: id },
    });

    return user;
  }

  // Find a user by Phone or Email
  async findOneByPhoneOrEmail(phone: string, email: string) {
    return await this.findOne({
      where: [{ email }, { phone }],
    });
  }

  // Create a user
  async createAndSave(userRegisterDto: UserRegisterDto) {
    return await this.save(userRegisterDto);
  }

  // Charge cash
  async chargeCash(user: UserEntity, userChargeDto: UserChargeDto) {
    user.wallet.cashAmount += userChargeDto.cashAmountToCharge;
    return await this.save(user);
  }

  // Send cash
  async sendCash(
    user: UserEntity,
    targetUser: UserEntity,
    cashAmountToSend: number,
  ) {
    // user wallet 에서 출금
    user.wallet.cashAmount -= cashAmountToSend;
    const updatedUser = await this.save(user);

    // target user wallet 에 입금
    targetUser.wallet.cashAmount += cashAmountToSend;
    const updatedTargetUser = await this.save(targetUser);

    return {
      user: updatedUser,
      targetUser: updatedTargetUser,
      cashAmount: cashAmountToSend,
    };
  }

  // Register wallet
  async registerWallet(user: UserEntity, wallet: WalletEntity) {
    user.wallet = wallet;
    return await this.save(user);
  }

  // Check whether user has enough cash or not
  checkUserHasEnoughCashOrThrow(user: UserEntity, cashAmount: number): void {
    if (user.wallet.cashAmount < cashAmount) {
      throw new BadRequestException("You don't have enough cash to send.");
    }
  }

  // Check whether user exist or not
  checkUserExistOrThrow(user: UserEntity | undefined): void {
    if (!user) {
      throw new UnauthorizedException('No user matches.');
    }
  }

  // Check whether wallet exist or not
  checkWalletExistOrThrow(user: UserEntity): void {
    if (!user.wallet) {
      throw new BadRequestException('Cannot find wallet.');
    }
  }

  // Check whether user and wallet or not
  checkUserAndWalletExistOrThrow(user: UserEntity | undefined): void {
    this.checkUserExistOrThrow(user);
    this.checkWalletExistOrThrow(user);
  }
}
