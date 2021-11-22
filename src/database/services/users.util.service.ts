import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import { nanoid } from 'nanoid/async';
import { CryptoService } from '../../common/services/crypto.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersUtilService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserByEmail(email: string, populate = []): Promise<User | null> {
    return await this.userModel
      .findOne({ email: email.toLowerCase() })
      .populate(populate)
      .exec();
  }

  async findUserById(userId: string, populate = []): Promise<User | null> {
    return await this.userModel.findById(userId).populate(populate).exec();
  }

  async registerNewUser(
    registerUserDto: RegisterUserDto,
    fields = {},
  ): Promise<User> {
    const user = await this.findUserByEmail(registerUserDto.email);
    if (user) {
      throw new BadRequestException([`email already exist`]);
    }

    const token = (await nanoid()) + CryptoService.randomToken(6);
    const tokenEncrypted = CryptoService.encrypt(token);

    const encryptPassword = await bcrypt.hash(registerUserDto.password, 10);
    const values = {
      ...registerUserDto,
      ...fields,
      token: tokenEncrypted,
      password: encryptPassword,
    };

    const createdUser = new this.userModel(values);
    await createdUser.save();

    return createdUser;
  }

  async updateUserById(userId: string, fields: any) {
    if (fields.password) {
      await this.setUserNewPassword(userId, fields.password);
      delete fields.password;
    }

    return this.userModel.updateOne(
      { _id: userId },
      {
        ...fields,
        updatedAt: new Date(),
      },
    );
  }

  async deleteUserById(userId: string) {
    // Delete user
    await this.userModel.deleteOne({ _id: userId });
  }

  async findUserByToken(token: string, populate = []): Promise<User | null> {
    const tokenEncrypted = CryptoService.encrypt(token);
    return await this.userModel
      .findOne({ token: tokenEncrypted })
      .populate(populate)
      .exec();
  }

  async findUserByEmailPass(
    email: string,
    pass: string,
    skipPassword = false,
  ): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    // Skip check password
    if (skipPassword) {
      return user;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  async setUserNewPassword(userId: string, password: string) {
    const encryptPassword = await bcrypt.hash(password, 10);
    await this.userModel.updateOne(
      { _id: userId },
      { password: encryptPassword, resetToken: null },
    );
    return encryptPassword;
  }
}
