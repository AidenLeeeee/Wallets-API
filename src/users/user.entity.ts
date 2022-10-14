import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Wallet } from 'src/wallets/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column({ length: 20, name: 'user_name' })
  userName: string;

  @IsPositive()
  @IsNumber()
  @Column({ nullable: true, name: 'birth_year' })
  birthYear: number;

  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @IsPhoneNumber('KR')
  @IsString()
  @Column({ unique: true })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;
}
