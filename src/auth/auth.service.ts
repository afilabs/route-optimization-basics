import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersUtilService } from '../database/services/users.util.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersUtilService: UsersUtilService,
  ) {}
}
