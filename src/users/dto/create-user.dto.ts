import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'Lucas Truong',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    default: 'lucas.truong.ex@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    default: '123123123',
  })
  @IsNotEmpty()
  readonly password: string;
}
