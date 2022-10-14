import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletRegisterDto } from '../dtos/wallet.register.dto';
import { User as UserEntity } from 'src/users/user.entity';
import { Wallet as WalletEntity } from '../wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletsRepository: Repository<WalletEntity>,
  ) {}

  async getAllWallets() {
    const allWallets = await this.walletsRepository.find();
    return allWallets;
  }

  async registerWallet(walletRegisterDto: WalletRegisterDto) {
    const { id, accountBank, accountNumber } = walletRegisterDto;

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wallet', 'wallet')
      .where('user.id = :id', { id })
      .getOne();

    // user 존재하는지 확인 (추후 로그인으로 대체)
    if (!user) {
      throw new UnauthorizedException('No user matches.');
    }
    // user 가 wallet 을 가지고 있는지 확인
    if (user.wallet) {
      throw new BadRequestException('Registered wallet already exists.');
    }

    const wallet = await this.walletsRepository
      .createQueryBuilder('wallet')
      .where('wallet.accountBank = :accountBank', { accountBank })
      .andWhere('wallet.accountNumber = :accountNumber', { accountNumber })
      .getOne();

    // 동일한 은행의 계좌와 연결된 wallet 이 존재하는지 확인
    if (wallet) {
      throw new BadRequestException('Your bank account is already in use.');
    }

    const newWallet = await this.walletsRepository.save({
      accountBank,
      accountNumber,
    });

    // User 의 wallet_id 와 생성된 wallet.id 를 연결
    user.wallet = newWallet;
    const newUser = await this.usersRepository.save(user);

    return newUser;
  }
}
