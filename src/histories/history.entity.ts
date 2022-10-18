import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { HistoryTypes } from 'src/common/types/types';
import { User as UserEntity } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('History')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @IsIn(HistoryTypes)
  @IsString()
  @IsNotEmpty()
  @Column()
  type: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Column({ name: 'cash_amount' })
  cashAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.history)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
