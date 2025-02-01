import { UserDocument } from './../../user/schemas/user.schema';
import { Body, Get, Post } from '@nestjs/common';
import { RegisterUserDto } from 'src/app/auth/DTOs/auth.dto';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserModel } from 'src/app/user/DTOs/user.dto';
import { BusinessController } from 'src/common/decorator/business-controller.decorator';
import { GetUser } from 'src/app/auth/decorators/get-user.decorator';
import { StandardApi } from 'src/common/standard-api.decorator';

@BusinessController('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/me')
  async me(@GetUser() user: UserDocument) {
    console.log(user);
    const result = await this.authService.me(1);

    return result;
  }

  @StandardApi({ type: UserModel })
  @Post('/register')
  async register(@Body() body: RegisterUserDto, @GetUser() user: UserDocument) {
    const result = await this.authService.register(body, user);

    return result;
  }
}
