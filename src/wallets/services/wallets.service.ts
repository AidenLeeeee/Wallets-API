import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';

@Injectable()
export class WalletsService {
  constructor(private readonly walletRepository: WalletRepository) {}

  // Find all wallets
  async getAllWallets() {
    return await this.walletRepository.findAll();
  }
}
