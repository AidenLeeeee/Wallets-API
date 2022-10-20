import { BadRequestException, Injectable } from '@nestjs/common';
import { HistoryTypes } from 'src/common/types/types';
import { HistoryRepository } from 'src/histories/repositories/history.repository';
import { TradeLogRepository } from 'src/trade-logs/repositories/trade-log.repository';
import { WalletRegisterDto } from 'src/wallets/dtos/wallet.register.dto';
import { WalletRepository } from 'src/wallets/repositories/wallet.repository';
import { Connection } from 'typeorm';
import { UserChargeDto } from '../dtos/user.charge.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserSendCashDto } from '../dtos/user.send.dto';
import { UserWithdrawDto } from '../dtos/user.withdraw.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tradeLogRepository: TradeLogRepository,
    private readonly historyRepository: HistoryRepository,
    private connection: Connection,
  ) {}

  // Find all users
  async getAllUsers() {
    return await this.userRepository.findAllWithWalletTable();
  }

  // Create a user
  async registerUser(userRegisterDto: UserRegisterDto) {
    await this.userRepository.findOneByPhoneOrEmailThenThrow(
      userRegisterDto.phone,
      userRegisterDto.email,
    );
    return await this.userRepository.createAndSave(userRegisterDto);
  }

  // Charge cash
  async chargeCash(id: number, userChargeDto: UserChargeDto) {
    const queryRunner = this.connection.createQueryRunner();
    const entityManager = queryRunner.manager;
    const userRepository = entityManager.getCustomRepository(UserRepository);
    const historyRepository =
      entityManager.getCustomRepository(HistoryRepository);

    // user 존재하는지 확인 (추후 로그인으로 대체)
    const user =
      await userRepository.findOneByIdWithWalletAndHistoryTablesOrThrow(id);

    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // Charge cash
      const chargedUser = await userRepository.chargeCash(user, userChargeDto);
      // Create a deposit history
      const depositHistory = await historyRepository.createAndSave({
        type: HistoryTypes[0],
        cashAmount: userChargeDto.cashAmountToCharge,
      });
      // Register history to user
      const registerRes = await userRepository.registerHistory(
        chargedUser,
        depositHistory,
      );

      await queryRunner.commitTransaction();
      return registerRes;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }

  // Withdraw cash
  async withdrawCash(id: number, userWithdrawDto: UserWithdrawDto) {
    const queryRunner = this.connection.createQueryRunner();
    const entityManager = queryRunner.manager;
    const userRepository = entityManager.getCustomRepository(UserRepository);
    const historyRepository =
      entityManager.getCustomRepository(HistoryRepository);
    const { cashAmountToWithdraw } = userWithdrawDto;

    // user 존재하는지 확인 (추후 로그인으로 대체)
    const user =
      await userRepository.findOneByIdWithWalletAndHistoryTablesOrThrow(id);

    // user 가 충분한 CashAmount 를 보유하고 있는지 확인
    user.wallet.checkWalletHasEnoughCashOrThrow(cashAmountToWithdraw);

    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // Withdraw cash
      const withdrawnUser = await userRepository.withdrawCash(
        user,
        userWithdrawDto,
      );
      // Create a withdrawal history
      const withdrawalHistory = await historyRepository.createAndSave({
        type: HistoryTypes[1],
        cashAmount: cashAmountToWithdraw,
      });
      // Register history to user
      const registerRes = await userRepository.registerHistory(
        withdrawnUser,
        withdrawalHistory,
      );

      await queryRunner.commitTransaction();
      return registerRes;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }

  // Send cash
  async sendCash(id: number, userSendCashDto: UserSendCashDto) {
    const queryRunner = this.connection.createQueryRunner();
    const entityManager = queryRunner.manager;
    const userRepository = entityManager.getCustomRepository(UserRepository);
    const tradeLogRepository =
      entityManager.getCustomRepository(TradeLogRepository);
    const historyRepository =
      entityManager.getCustomRepository(HistoryRepository);

    const { targetId, cashAmountToSend } = userSendCashDto;

    // user, targetUser 존재하는지 확인 (추후 로그인으로 대체)
    // user, targetUser 에게 등록된 wallet 이 있는지 확인
    const user =
      await userRepository.findOneByIdWithWalletAndHistoryTablesOrThrow(id);
    const targetUser =
      await userRepository.findOneByIdWithWalletAndHistoryTablesOrThrow(
        targetId,
      );

    // user 가 충분한 CashAmount 를 보유하고 있는지 확인
    user.wallet.checkWalletHasEnoughCashOrThrow(cashAmountToSend);

    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // Send cash
      const { updatedUser, updatedTargetUser, cashAmount } =
        await userRepository.sendCash(user, targetUser, cashAmountToSend);
      // Create a trade log
      const tradeLogResult = await tradeLogRepository.createAndSave({
        senderId: updatedUser.id,
        receiverId: updatedTargetUser.id,
        cashAmount: cashAmount,
      });
      // Create a history
      const senderHistoryResult = await historyRepository.createAndSave({
        type: HistoryTypes[1],
        cashAmount: cashAmount,
      });
      const receiverHistoryResult = await historyRepository.createAndSave({
        type: HistoryTypes[0],
        cashAmount: cashAmount,
      });
      // Register history to user
      const sender = await userRepository.registerHistory(
        updatedUser,
        senderHistoryResult,
      );
      const receiver = await userRepository.registerHistory(
        updatedTargetUser,
        receiverHistoryResult,
      );
      // Make Response
      const res = {
        sender,
        receiver,
        tradeLog: tradeLogResult,
      };

      await queryRunner.commitTransaction();
      return res;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }

  // Get cash
  async getCash(id: number) {
    const user = await this.userRepository.findOneByIdWithWalletTableOrThrow(
      id,
      true,
    );
    return user.wallet.getCash();
  }

  // Get trade log
  async getTradeLog(id: number) {
    return await this.tradeLogRepository.findAllByUserId(id);
  }

  // Get history
  async getHistory(id: number) {
    await this.userRepository.findOneByIdWithWalletTableOrThrow(id, true);
    return await this.historyRepository.findAllHistoryByUserId(id);
  }

  // Get deposit history
  async getDepositHistory(id: number) {
    await this.userRepository.findOneByIdWithWalletTableOrThrow(id, true);
    return await this.historyRepository.findAllHistoryByUserIdWithTypes(
      id,
      HistoryTypes[0],
    );
  }

  // Get withdrawal history
  async getWithdrawalHistory(id: number) {
    await this.userRepository.findOneByIdWithWalletTableOrThrow(id, true);
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
    const queryRunner = this.connection.createQueryRunner();
    const entityManager = queryRunner.manager;
    const userRepository = entityManager.getCustomRepository(UserRepository);
    const walletRepository =
      entityManager.getCustomRepository(WalletRepository);

    // user 가 존재하는지 확인
    const user = await userRepository.findOneByIdWithWalletTableOrThrow(
      id,
      false,
    );

    // 동일한 계좌로 등록된 wallet 이 존재하는지 확인
    await walletRepository.checkBankAndNumberExist(walletRegisterDto);

    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      // Create a wallet
      const newWallet = await walletRepository.createAndSave(walletRegisterDto);
      // Register wallet to User
      const registerRes = await userRepository.registerWallet(user, newWallet);

      await queryRunner.commitTransaction();
      return registerRes;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }
}
