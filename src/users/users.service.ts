import { Model } from 'mongoose';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { UsersUtilService } from '../database/services/users.util.service';
import { UsersValidateService } from '../database/services/users.validate.service';
import { UserResponseDto } from './dto/user-response.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { FindUsersResponseDto } from './dto/find-users-response.dto';
import { SuccessResponseDto } from '../database/dto/success-response.dto';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
    private usersUtilService: UsersUtilService,
    private usersValidateService: UsersValidateService,
  ) {}

  async createNewUser(createUserDto: CreateUserDto) {
    // Create a user
    const createdUser = await this.usersUtilService.registerNewUser(
      createUserDto,
    );

    return await this.responseUser(createdUser._id.toString());
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    // Validate relationships
    await this.usersValidateService.validateUserById(userId);

    // Update user
    const fields: any = { ...updateUserDto };
    await this.usersUtilService.updateUserById(userId, fields);

    return await this.responseUser(userId);
  }

  async deleteUser(userId: string) {
    await this.usersValidateService.validateUserById(userId);
    await this.usersUtilService.deleteUserById(userId);
    return new SuccessResponseDto();
  }

  async findAllUsers(findUsersDto: FindUsersDto) {
    const {
      currentPage: page,
      itemsPerPage: limit,
      name,
      email,
    } = findUsersDto;

    const skip = (page - 1) * limit;
    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    const users = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const count = await this.userModel.countDocuments(filter);

    return new FindUsersResponseDto(users, count, findUsersDto);
  }

  async responseUser(userId: string) {
    const user = await this.usersUtilService.findUserById(userId);
    return new UserResponseDto(user);
  }
}
