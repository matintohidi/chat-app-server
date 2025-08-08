import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LoginUserDto,
  LoginUserModel,
  RegisterUserModel,
  CreateUserDto,
} from 'src/app/auth/dto/auth.dto';
import { ErrorCode } from 'src/common/enums/error.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { JwtPayload } from 'src/app/auth/dto/jwt.dto';
import { User } from 'src/app/user/schemas/user.schema';
import {
  EXPIRES_IN,
  EXPIRES_IN_SET_PROFILE,
  JWT_SECRET,
  JWT_SECRET_SET_PROFILE,
} from 'src/configs/app.config';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async me(userId: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new NotFoundException('The User ');
    }

    return user;
  }

  async register(dto: CreateUserDto): Promise<RegisterUserModel> {
    const existUser = await this.userModel.findOne({
      email: dto.email,
    });

    if (existUser) {
      throw new BadRequestException(ErrorCode.UserWithThisEmailAlreadyExists);
    }

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({ ...dto, password });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: EXPIRES_IN_SET_PROFILE,
      secret: JWT_SECRET_SET_PROFILE,
    });

    return { token, user };
  }

  async login(dto: LoginUserDto): Promise<LoginUserModel> {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new NotFoundException(ErrorCode.UserNotFound);
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException(ErrorCode.PasswordOrEmailIsNotMatch);
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: EXPIRES_IN,
      secret: JWT_SECRET,
    });

    return { token, user };
  }
}
