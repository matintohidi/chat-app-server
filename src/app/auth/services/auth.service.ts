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
import { JwtPayload } from 'src/app/auth/DTOs/jwt.dto';

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

  async register(data: RegisterUserDto): Promise<UserModel> {
    const existUser = await this.userRepository.findOne({
      $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
    });

    if (existUser) {
      throw new BadRequestException(
        ErrorCode.UserWithThisEmailOrPhoneNumberAlreadyExists,
      );
    }

    const password = await bcrypt.hash(data.password, 10);

    const user = await this.userService.create({ ...data, password });

    return user;
  }

  async login(data: LoginUserDto): Promise<LoginUserModel> {
    const user = await this.userRepository.findOneOrFail({ email: data.email });

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(ErrorCode.PasswordIsNotMatch);
    }

    const payload: JwtPayload = {
      sub: user._id as unknown as string,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }
}
