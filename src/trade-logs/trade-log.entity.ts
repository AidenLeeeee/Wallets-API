import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('TradeLog')
export class TradeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Column({ name: 'sender_id' })
  senderId: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Column({ name: 'receiver_id' })
  receiverId: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Column({ name: 'cash_amount' })
  cashAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
