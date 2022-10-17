import { BadRequestException, UnauthorizedException } from '@nestjs/common';
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
  async findOneByIdWithWalletTable(id: number) {
    const user = await this.findOne({
      relations: ['wallet'],
      where: { id: id },
    });

    return user;
  }

  // Find a user by Id with wallet and history tables
  async findOneByIdWithWalletAndHistoryTables(id: number) {
    const user = await this.findOne({
      relations: ['wallet', 'history'],
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

  // Find a history
  async findAllHistoryWithColumnsById(id: number, columns: string[]) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.history', 'history')
      .orderBy('history.createdAt', 'DESC')
      .select(columns)
      .where('user.id = :id', { id })
      .getOne();
  }

  // Find a history by filtered conditions
  async findAllHistoryFilteredByTypes(
    id: number,
    columns: string[],
    types: string,
  ) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.history', 'history', 'history.types = :types', {
        types,
      })
      .orderBy('history.createdAt', 'DESC')
      .select(columns)
      .where('user.id = :id', { id })
      .getOne();
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

  // Withdraw cash
  async withdrawCash(user: UserEntity, userWithdrawDto: UserWithdrawDto) {
    user.wallet.cashAmount -= userWithdrawDto.cashAmountToWithdraw;
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
      updatedUser: updatedUser,
      updatedTargetUser: updatedTargetUser,
      cashAmount: cashAmountToSend,
    };
  }

  // Register wallet
  async registerWallet(user: UserEntity, wallet: WalletEntity) {
    user.wallet = wallet;
    return await this.save(user);
  }

  // Register history
  async registerHistory(user: UserEntity, history: HistoryEntity) {
    user.history.push(history);
    return await this.save(user);
  }

  // Check whether user has enough cash or not
  checkUserHasEnoughCashOrThrow(user: UserEntity, cashAmount: number): void {
    if (user.wallet.cashAmount < cashAmount) {
      throw new BadRequestException("ERROR: You don't have enough cash.");
    }
  }

  // Check whether user exist or not
  checkUserExistOrThrow(user: UserEntity | undefined): void {
    if (!user) {
      throw new UnauthorizedException('ERROR: No user matches.');
    }
  }

  // Check whether wallet exist or not
  checkWalletExistOrThrow(user: UserEntity): void {
    if (!user.wallet) {
      throw new BadRequestException('ERROR: Cannot find wallet.');
    }
  }

  // Check whether user and wallet or not
  checkUserAndWalletExistOrThrow(user: UserEntity | undefined): void {
    this.checkUserExistOrThrow(user);
    this.checkWalletExistOrThrow(user);
  }
}
