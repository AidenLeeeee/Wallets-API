import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { User } from 'src/users/user.entity';
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

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  user: User;
}
