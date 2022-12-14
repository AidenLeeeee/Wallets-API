import { ApiProperty, PickType } from '@nestjs/swagger';
import { History as HistoryEntity } from '../history.entity';

export class HistoryRegisterDto extends PickType(HistoryEntity, [
  'type',
  'cashAmount',
] as const) {
  @ApiProperty({
    example: 'deposit',
    description: "'deposit' or 'withdrawal'",
  })
  type: string;

  @ApiProperty({
    example: '10000',
    description: 'Cash amount for deposit or withdrawal',
  })
  cashAmount: number;
}
