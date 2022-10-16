import { EntityRepository, Repository } from 'typeorm';
import { WalletRegisterDto } from '../dtos/wallet.register.dto';
import { Wallet as WalletEntity } from '../wallet.entity';

@EntityRepository(WalletEntity)
export class WalletRepository extends Repository<WalletEntity> {
  // Find all wallets
  async findAll() {
    return await this.find();
  }

  // Find a wallet by Account Bank or Account Number
  async findOneByBankAndNumber(walletRegisterDto: WalletRegisterDto) {
    return await this.findOne({
      where: {
        accountBank: walletRegisterDto.accountBank,
        accountNumber: walletRegisterDto.accountNumber,
      },
    });
  }

  // Create a wallet
  async createAndSave(walletRegisterDto: WalletRegisterDto) {
    return await this.save(walletRegisterDto);
  }
}
