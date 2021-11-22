import { UniqueTokenStrategy } from 'passport-unique-token';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersUtilService } from '../../database/services/users.util.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(UniqueTokenStrategy) {
  constructor(private usersUtilService: UsersUtilService) {
    super({
      tokenHeader: 'api_key',
    });
  }

  async validate(token: string) {
    const user = await this.usersUtilService.findUserByToken(token);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
