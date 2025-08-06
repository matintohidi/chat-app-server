import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessRepository } from 'src/app/base/basic.repository';
import { User } from 'src/app/user/schemas/user.schema';

export class UserRepository extends BusinessRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }

  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    const result = this.userModel.findOne({ email }).select('+password').exec();

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
