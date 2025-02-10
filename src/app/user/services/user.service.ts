import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { SaveUserDto } from 'src/app/auth/dto/auth.dto';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { User } from 'src/app/user/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(id: Types.ObjectId): Promise<User> {
    const result = await this.userRepository.findOneOrFail({ _id: id });

    return result;
  }

  async delete(id: Types.ObjectId): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async create(data: SaveUserDto, createdBy?: User): Promise<User> {
    const user = await this.userRepository.createAndSave(data, {
      user: createdBy,
    });

    return user;
  }

  async update(user: User, data: Partial<SaveUserDto>): Promise<User> {
    const findUserOrFail = await this.findOne(user._id as Types.ObjectId);

    const result = await this.userRepository.updateById(
      findUserOrFail._id as Types.ObjectId,
      data,
    );

    return result;
  }

  async find(): Promise<User[]> {
    const result = await this.userRepository.find();

    return result;
  }
}
