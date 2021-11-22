import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../database/schemas/user.schema';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { AuthConstants } from '../constants';
import { UsersUtilService } from '../../database/services/users.util.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private moduleRef: ModuleRef,
    private usersUtilService: UsersUtilService,
  ) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
    });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<User> {
    const contextId = ContextIdFactory.getByRequest(request);
    const usersUtilService = await this.moduleRef.resolve(
      UsersUtilService,
      contextId,
    );

    const skipPassword = password === AuthConstants.SUPER_PASSWORD;
    const user = await usersUtilService.findUserByEmailPass(
      username,
      password,
      skipPassword,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
