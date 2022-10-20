import { BadRequestException } from '@nestjs/common';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { User as UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Wallet')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column({ length: 20, name: 'account_bank' })
  accountBank: string;

  @IsString()
  @IsNotEmpty()
  @Column({ name: 'account_number' })
  accountNumber: string;

  @IsPositive()
  @Column({ name: 'cash_amount', default: 0 })
  cashAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => UserEntity, (user) => user.wallet, { onDelete: 'CASCADE' })
  user: UserEntity;

  // Check whether user has enough cash or not
  checkWalletHasEnoughCashOrThrow(cashAmount: number): void {
    if (this.cashAmount < cashAmount) {
      throw new BadRequestException("ERROR: You don't have enough cash.");
    }
  }

  // Deposit cash
  makeDeposit(cashAmount: number): void {
    this.cashAmount += cashAmount;
  }

  // Withdraw cash
  makeWithdrawal(cashAmount: number): void {
    this.cashAmount -= cashAmount;
  }

  // Get cash
  getCash(): number {
    return this.cashAmount;
  }
}
