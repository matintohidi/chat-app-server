import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from 'src/app/auth/dto/auth.dto';
import { User } from 'src/app/user/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async find(): Promise<User[]> {
    const users = await this.userModel.find();

    return users;
  }

  async findOne(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create(dto);

    return user;
  }

  async update(id: Types.ObjectId, dto: Partial<UpdateUserDto>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, dto);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
