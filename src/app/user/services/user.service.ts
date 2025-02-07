import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/app/auth/dto/auth.dto';
import { UserModel } from 'src/app/user/dto/user.dto';
import { UserRepository } from 'src/app/user/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(
    data: RegisterUserDto,
    createdBy?: UserModel,
  ): Promise<UserModel> {
    const user = await this.userRepository.createAndSave(data, {
      user: createdBy,
    });

    return user;
  }
}
