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

  @Column({ length: 20, name: 'account_bank' })
  accountBank: string;

  @Column({ name: 'account_number', unique: true })
  accountNumber: number;

  @Column({ name: 'cash_amount', default: 0 })
  cashAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne((type) => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  user: User;
}
