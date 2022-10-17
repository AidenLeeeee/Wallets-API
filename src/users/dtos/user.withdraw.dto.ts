import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Min, Max } from 'class-validator';

export class UserWithdrawDto {
  @ApiProperty({
    example: 10000,
    description: 'Cash amount to withdraw',
  })
  @Min(10000)
  @Max(1000000)
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  cashAmountToWithdraw: number;
}
