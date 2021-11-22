import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersValidateService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async validateUserById(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException([`user not exist`]);
    }
    return user;
  }
}
