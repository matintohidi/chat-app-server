import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/app/auth/DTOs/auth.dto';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { User, UserDocument } from 'src/app/user/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(data: RegisterUserDto, createdBy: UserDocument): Promise<User> {
    const user = await this.userRepository.createAndSave(data, {
      user: createdBy,
    });

    return user;
  }
}
