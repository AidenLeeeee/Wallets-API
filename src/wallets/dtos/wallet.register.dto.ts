import { ApiProperty, PickType } from '@nestjs/swagger';
import { Wallet as WalletEntity } from '../wallet.entity';

export class WalletRegisterDto extends PickType(WalletEntity, [
  'accountBank',
  'accountNumber',
] as const) {
  @ApiProperty({
    example: 'ShinhanBank',
    description: 'name of bank',
  })
  accountBank: string;

  @ApiProperty({
    example: '123456-06-520374',
    description: 'account number',
  })
  accountNumber: string;
}
