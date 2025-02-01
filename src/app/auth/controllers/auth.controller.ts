import { Body, Get, Post } from '@nestjs/common';
import {
  LoginUserDto,
  LoginUserModel,
  RegisterUserDto,
} from 'src/app/auth/DTOs/auth.dto';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserModel } from 'src/app/user/DTOs/user.dto';
import { BusinessController } from 'src/common/decorator/business-controller.decorator';
import { GetUser } from 'src/app/auth/decorators/get-user.decorator';
import { StandardApi } from 'src/common/standard-api.decorator';
import { ApiAccessLevel } from 'src/app/auth/enum/permission.enum';
import { ApiPermission } from 'src/app/auth/decorators/permission.decorator';
import { Types } from 'mongoose';

@BusinessController('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiPermission([ApiAccessLevel.USER])
  @StandardApi({ type: UserModel })
  @Get('/me')
  async me(@GetUser() user: UserModel): Promise<UserModel> {
    const result = await this.authService.me(user._id as Types.ObjectId);

    return result;
  }

  @StandardApi({ type: UserModel })
  @Post('/register')
  async register(
    @Body() body: RegisterUserDto,
    @GetUser() user: UserModel,
  ): Promise<UserModel> {
    const result = await this.authService.register(body, user);

    return result;
  }

  @StandardApi({ type: LoginUserModel })
  @Post('/login')
  async login(@Body() body: LoginUserDto): Promise<LoginUserModel> {
    const result = await this.authService.login(body);

    return result;
  }
}
