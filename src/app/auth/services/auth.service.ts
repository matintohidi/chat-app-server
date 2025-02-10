import { UserRepository } from 'src/app/user/repositories/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  LoginUserDto,
  LoginUserModel,
  RegisterUserDto,
  RegisterUserModel,
} from 'src/app/auth/dto/auth.dto';
import { ErrorCode } from 'src/common/enums/error.enum';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/app/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { JwtPayload } from 'src/app/auth/dto/jwt.dto';
import { User } from 'src/app/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async me(userId: Types.ObjectId): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ _id: userId });

    return user;
  }

  async register(data: RegisterUserDto): Promise<RegisterUserModel> {
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

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload, { expiresIn: '5m' });

    return { token, user };
  }

  async login(data: LoginUserDto): Promise<LoginUserModel> {
    const user = await this.userRepository.findUserByEmailWithPassword(
      data.email,
    );

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(ErrorCode.PasswordIsNotMatch);
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }
}
