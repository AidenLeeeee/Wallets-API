import { UnauthorizedException } from '@nestjs/common';
import { History as HistoryEntity } from 'src/histories/history.entity';
import { Wallet as WalletEntity } from 'src/wallets/wallet.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserChargeDto } from '../dtos/user.charge.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserWithdrawDto } from '../dtos/user.withdraw.dto';
import { User as UserEntity } from '../user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  // Find all users with wallet table
  async findAllWithWalletTable() {
    return await this.find({ relations: ['wallet'] });
  }

  // Find all users with wallet and history tables
  async findAllWithWalletAndHistoryTables() {
    return await this.find({
      relations: ['wallet', 'history'],
    });
  }

  // Find a user by Id with wallet table
  async findOneByIdWithWalletTableOrThrow(id: number, walletExist: boolean) {
    const user = await this.findOne({
      relations: ['wallet'],
      where: { id: id },
    });

    if (!user) {
      throw new UnauthorizedException('ERROR: No user matches.');
    }

    if (walletExist) {
      user.checkUserHasWalletOrThrow();
    } else {
      user.checkUserHasWalletAndThrow();
    }

    return user;
  }

  // Find a user by Id with wallet and history tables
  async findOneByIdWithWalletAndHistoryTablesOrThrow(id: number) {
    const user = await this.findOne({
      relations: ['wallet', 'history'],
      where: { id: id },
    });

    if (!user) {
      throw new UnauthorizedException('ERROR: No user matches.');
    }
    user.checkUserHasWalletOrThrow();

    return user;
  }

  // Find a user by Phone or Email
  async findOneByPhoneOrEmailThenThrow(phone: string, email: string) {
    const user = await this.findOne({
      where: [{ email }, { phone }],
    });

    if (user) {
      throw new UnauthorizedException('Your Account already exists.');
    }
  }

  // Create a user
  async createAndSave(userRegisterDto: UserRegisterDto) {
    return await this.save(userRegisterDto);
  }

  // Register wallet
  async registerWallet(user: UserEntity, wallet: WalletEntity) {
    user.registerWallet(wallet);
    return await this.save(user);
  }

  // Charge cash
  async chargeCash(user: UserEntity, { cashAmountToCharge }: UserChargeDto) {
    user.wallet.makeDeposit(cashAmountToCharge);
    return await this.save(user);
  }

  // Withdraw cash
  async withdrawCash(
    user: UserEntity,
    { cashAmountToWithdraw }: UserWithdrawDto,
  ) {
    user.wallet.makeWithdrawal(cashAmountToWithdraw);
    return await this.save(user);
  }

  // Send cash
  async sendCash(
    user: UserEntity,
    targetUser: UserEntity,
    cashAmountToSend: number,
  ) {
    // user wallet 에서 출금
    user.wallet.makeWithdrawal(cashAmountToSend);
    const updatedUser = await this.save(user);

    // target user wallet 에 입금
    targetUser.wallet.makeDeposit(cashAmountToSend);
    const updatedTargetUser = await this.save(targetUser);

    return {
      updatedUser: updatedUser,
      updatedTargetUser: updatedTargetUser,
      cashAmount: cashAmountToSend,
    };
  }

  // Register history
  async registerHistory(user: UserEntity, history: HistoryEntity) {
    user.registerHistory(history);
    return await this.save(user);
  }
}
