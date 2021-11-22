import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../database/schemas/user.schema';
import { CryptoService } from '../../common/services/crypto.service';

export class UserResponseDto {
  @ApiProperty({ default: '60d182e3e02cce2ebd1551bf' })
  _id: string;

  @ApiProperty({ default: 'Lucas Truong' })
  name: string;

  @ApiProperty({ default: 'lucas.truong.ex@gmail.com' })
  email: string;

  @ApiProperty({ default: 't3B8dl9tmS_' })
  token: string;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(user: User) {
    const keys = [
      'name',
      'email',
      // Dates
      'createdAt',
      'updatedAt',
    ];
    keys.forEach((prop) => (this[prop] = user[prop]));
    this._id = user._id.toString();

    this.token = user.token ? CryptoService.decrypt(user.token) : null;
  }
}
