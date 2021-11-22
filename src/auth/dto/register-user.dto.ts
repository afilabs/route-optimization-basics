import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    default: 'Lucas Truong',
  })
  @ApiProperty()
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
  @MinLength(6)
  readonly password: string;
}
