import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HistoryTypes } from 'src/common/types/types';
import { HistoryRegisterDto } from 'src/histories/dtos/history.register.dto';
import { HistoryRepository } from 'src/histories/repositories/history.repository';
import { TradeLogCreateDto } from 'src/trade-logs/dtos/trade-log.create.dto';
import { TradeLogRepository } from 'src/trade-logs/repositories/trade-log.repository';
import { WalletRegisterDto } from 'src/wallets/dtos/wallet.register.dto';
import { WalletRepository } from 'src/wallets/repositories/wallet.repository';
import { UserChargeDto } from '../dtos/user.charge.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserSendCashDto } from '../dtos/user.send.dto';
import { UserWithdrawDto } from '../dtos/user.withdraw.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
    private readonly tradeLogRepository: TradeLogRepository,
    private readonly historyRepository: HistoryRepository,
  ) {}

  // Find all users
  async getAllUsers() {
    return await this.userRepository.findAllWithWalletTable();
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
    const TYPES = HistoryTypes[0];
    // user 존재하는지 확인 (추후 로그인으로 대체)
    const user =
      await this.userRepository.findOneByIdWithWalletAndHistoryTables(id);
    // user 에게 등록된 wallet 존재하는지 확인
    this.userRepository.checkUserAndWalletExistOrThrow(user);

    // Charge cash
    const chargedUser = await this.userRepository.chargeCash(
      user,
      userChargeDto,
    );

    // Create a deposit history
    const historyRegisterDto: HistoryRegisterDto = {
      type: TYPES,
      cashAmount: userChargeDto.cashAmountToCharge,
    };
    const depositHistory = await this.historyRepository.createAndSave(
      historyRegisterDto,
    );

    // Register history to user
    return await this.userRepository.registerHistory(
      chargedUser,
      depositHistory,
    );
  }

  // Withdraw cash
  async withdrawCash(id: number, userWithdrawDto: UserWithdrawDto) {
    const TYPES = HistoryTypes[1];
    // user 존재하는지 확인 (추후 로그인으로 대체)
    const user =
      await this.userRepository.findOneByIdWithWalletAndHistoryTables(id);
    // user 에게 등록된 wallet 존재하는지 확인
    this.userRepository.checkUserAndWalletExistOrThrow(user);

    // user 가 충분한 CashAmount 를 보유하고 있는지 확인
    this.userRepository.checkUserHasEnoughCashOrThrow(
      user,
      userWithdrawDto.cashAmountToWithdraw,
    );

    // Withdraw cash
    const withdrawnUser = await this.userRepository.withdrawCash(
      user,
      userWithdrawDto,
    );

    // Create a withdrawal history
    const historyRegisterDto: HistoryRegisterDto = {
      type: TYPES,
      cashAmount: userWithdrawDto.cashAmountToWithdraw,
    };
    const withdrawalHistory = await this.historyRepository.createAndSave(
      historyRegisterDto,
    );

    // Register history to user
    return await this.userRepository.registerHistory(
      withdrawnUser,
      withdrawalHistory,
    );
  }

  // Send cash
  async sendCash(id: number, userSendCashDto: UserSendCashDto) {
    const { targetId, cashAmountToSend } = userSendCashDto;

    // user, targetUser 존재하는지 확인 (추후 로그인으로 대체)
    // user, targetUser 에게 등록된 wallet 이 있는지 확인
    const user =
      await this.userRepository.findOneByIdWithWalletAndHistoryTables(id);
    this.userRepository.checkUserAndWalletExistOrThrow(user);
    const targetUser =
      await this.userRepository.findOneByIdWithWalletAndHistoryTables(targetId);
    this.userRepository.checkUserAndWalletExistOrThrow(targetUser);

    // user 가 충분한 CashAmount 를 보유하고 있는지 확인
    this.userRepository.checkUserHasEnoughCashOrThrow(user, cashAmountToSend);

    // Send cash
    const { updatedUser, updatedTargetUser, cashAmount } =
      await this.userRepository.sendCash(user, targetUser, cashAmountToSend);

    // Create a trade log
    const tradeLogCreateDto: TradeLogCreateDto = {
      senderId: updatedUser.id,
      receiverId: updatedTargetUser.id,
      cashAmount: cashAmount,
    };

    const tradeLogResult = await this.tradeLogRepository.createAndSave(
      tradeLogCreateDto,
    );

    // Create a history
    const senderHistoryRegisterDto: HistoryRegisterDto = {
      type: HistoryTypes[1],
      cashAmount: cashAmount,
    };
    const receiverHistoryRegisterDto: HistoryRegisterDto = {
      type: HistoryTypes[0],
      cashAmount: cashAmount,
    };

    const senderHistoryResult = await this.historyRepository.createAndSave(
      senderHistoryRegisterDto,
    );
    const sender = await this.userRepository.registerHistory(
      updatedUser,
      senderHistoryResult,
    );
    const receiverHistoryResult = await this.historyRepository.createAndSave(
      receiverHistoryRegisterDto,
    );
    const receiver = await this.userRepository.registerHistory(
      updatedTargetUser,
      receiverHistoryResult,
    );

    return {
      sender: sender,
      receiver: receiver,
      tradeLog: tradeLogResult,
    };
  }

  // Get cash
  async getCash(id: number) {
    const user = await this.userRepository.findOneByIdWithWalletTable(id);
    this.userRepository.checkUserAndWalletExistOrThrow(user);
    return user.wallet.cashAmount;
  }

  // Get trade log
  async getTradeLog(id: number) {
    return await this.tradeLogRepository.findAllByUserId(id);
  }

  // Get history
  async getHistory(id: number) {
    const user = await this.userRepository.findOneByIdWithWalletTable(id);
    this.userRepository.checkUserAndWalletExistOrThrow(user);
    return await this.historyRepository.findAllHistoryByUserId(id);
  }

  // Get deposit history
  async getDepositHistory(id: number) {
    const user = await this.userRepository.findOneByIdWithWalletTable(id);
    this.userRepository.checkUserAndWalletExistOrThrow(user);
    return await this.historyRepository.findAllHistoryByUserIdWithTypes(
      id,
      HistoryTypes[0],
    );
  }

  // Get withdrawal history
  async getWithdrawalHistory(id: number) {
    const user = await this.userRepository.findOneByIdWithWalletTable(id);
    this.userRepository.checkUserAndWalletExistOrThrow(user);
    return await this.historyRepository.findAllHistoryByUserIdWithTypes(
      id,
      HistoryTypes[1],
    );
  }

  // Register wallet
  async createAndRegisterWallet(
    id: number,
    walletRegisterDto: WalletRegisterDto,
  ) {
    // user 가 존재하는지 확인
    const user = await this.userRepository.findOneByIdWithWalletTable(id);
    this.userRepository.checkUserExistOrThrow(user);
    // user 에게 등록된 wallet 이 존재하는지 확인
    if (user.wallet) {
      throw new BadRequestException('You already have a wallet.');
    }

    // 동일한 계좌로 등록된 wallet 이 존재하는지 확인
    const wallet = await this.walletRepository.findOneByBankAndNumber(
      walletRegisterDto,
    );
    if (wallet) {
      throw new BadRequestException('Your bank account is already in use.');
    }

    const newWallet = await this.walletRepository.createAndSave(
      walletRegisterDto,
    );
    return await this.userRepository.registerWallet(user, newWallet);
  }
}
