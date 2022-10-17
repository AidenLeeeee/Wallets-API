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
  types: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Column()
  cashAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.history)
  user: UserEntity;
}
