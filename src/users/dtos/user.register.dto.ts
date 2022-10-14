import { ApiProperty, PickType } from '@nestjs/swagger';
import { User as UserEntity } from '../user.entity';

export class UserRegisterDto extends PickType(UserEntity, [
  'userName',
  'birthYear',
  'email',
  'phone',
] as const) {
  @ApiProperty({
    example: 'Aiden',
    description: 'name',
  })
  userName: string;

  @ApiProperty({
    example: 1997,
    description: 'year of birth',
  })
  birthYear: number;

  @ApiProperty({
    example: 'aidenlee@gmail.com',
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    example: '01012345678',
    description: 'phone number',
  })
  phone: string;
}
