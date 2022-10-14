import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class UserSendCashDto {
  @ApiProperty({
    example: 2,
    description: "ID of the target user you'd like to send cash to.",
  })
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  targetId: number;

  @ApiProperty({
    example: 10000,
    description: "Cash amount you'd like to send.",
  })
  @Min(10000)
  @Max(1000000)
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  cashAmountToSend: number;
}
