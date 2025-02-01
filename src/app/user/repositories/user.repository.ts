import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessRepository } from 'src/app/base/business.repository';
import { User } from 'src/app/user/schemas/user.schema';

export class UserRepository extends BusinessRepository<User> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }
}
