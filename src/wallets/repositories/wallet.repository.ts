import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { WalletRegisterDto } from '../dtos/wallet.register.dto';
import { Wallet as WalletEntity } from '../wallet.entity';

@EntityRepository(WalletEntity)
export class WalletRepository extends Repository<WalletEntity> {
  // Find all wallets
  async findAll() {
    return await this.find();
  }

  // Check the same Account Bank and Account Number are used
  async checkBankAndNumberExist({
    accountBank,
    accountNumber,
  }: WalletRegisterDto) {
    const wallet = await this.findOne({
      where: {
        accountBank: accountBank,
        accountNumber: accountNumber,
      },
    });

    if (wallet) {
      throw new BadRequestException('Your bank account is already in use.');
    }
  }

  // Create a wallet
  async createAndSave(walletRegisterDto: WalletRegisterDto) {
    return await this.save(walletRegisterDto);
  }
}
