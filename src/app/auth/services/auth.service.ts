import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  LoginUserDto,
  LoginUserModel,
  RegisterUserDto,
} from 'src/app/auth/DTOs/auth.dto';
import { User, UserDocument } from 'src/app/user/schemas/user.schema';
import { ErrorCode } from 'src/common/enums/error.enum';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/app/user/services/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async me(userId: number) {
    return {
      id: userId,
      name: 'John Doe',
      email: '',
    };
  }

  async register(
    data: RegisterUserDto,
    createdBy: UserDocument,
  ): Promise<User> {
    const existUser = await this.userRepository.findOne({
      email: data.email,
      phoneNumber: data.phoneNumber,
    });

    if (existUser) {
      throw new BadRequestException(
        ErrorCode.UserWithThisEmailOrPhoneNumberAlreadyExists,
      );
    }

    const password = await bcrypt.hash(data.password, 10);

    const user = await this.userService.create(
      { ...data, password },
      createdBy,
    );

    return user;
  }

  async login(data: LoginUserDto): Promise<LoginUserModel> {
    const user = await this.userRepository.findOneOrFail({ email: data.email });

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(ErrorCode.PasswordIsNotMatch);
    }

    const token = this.jwtService.sign({ sub: user._id, email: user.email });

    return { token };
  }
}
