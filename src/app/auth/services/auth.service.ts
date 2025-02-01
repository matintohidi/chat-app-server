import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  LoginUserDto,
  LoginUserModel,
  RegisterUserDto,
} from 'src/app/auth/DTOs/auth.dto';
import { ErrorCode } from 'src/common/enums/error.enum';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/app/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/app/user/DTOs/user.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async me(userId: Types.ObjectId): Promise<UserModel> {
    const user = await this.userRepository.findOneOrFail({ _id: userId });

    return user;
  }

  async register(
    data: RegisterUserDto,
    createdBy: UserModel,
  ): Promise<UserModel> {
    const existUser = await this.userRepository.findOne({
      $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
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

    const token = await this.jwtService.signAsync({
      sub: user._id,
      email: user.email,
    });

    return { token, user };
  }
}
