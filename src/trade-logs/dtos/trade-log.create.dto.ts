import { ApiProperty, PickType } from '@nestjs/swagger';
import { TradeLog as TradeLogEntity } from '../trade-log.entity';

export class TradeLogCreateDto extends PickType(TradeLogEntity, [
  'senderId',
  'receiverId',
  'cashAmount',
]) {
  @ApiProperty({
    example: 2,
    description: 'Id of the Cash sender.',
  })
  senderId: number;

  @ApiProperty({
    example: 4,
    description: 'Id of the Cash receiver.',
  })
  receiverId: number;

  @ApiProperty({
    example: 300000,
    description: 'Cash amount transferred.',
  })
  cashAmount: number;
}
