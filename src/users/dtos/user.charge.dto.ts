import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Min, Max } from 'class-validator';

export class UserChargeDto {
  @ApiProperty({
    example: 10000,
    description: 'Cash amount to charge',
  })
  @Min(10000)
  @Max(1000000)
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  cashAmountToCharge: number;
}
