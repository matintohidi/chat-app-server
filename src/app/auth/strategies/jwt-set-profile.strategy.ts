import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/app/auth/dto/jwt.dto';
import { AuthStrategies } from 'src/app/auth/enums/jwt.enum';
import { User } from 'src/app/user/schemas/user.schema';
import { JWT_SECRET_SET_PROFILE } from 'src/configs/app.config';

@Injectable()
export class JwtSetProfileStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.JWT_SET_PROFILE,
) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_SET_PROFILE,
    });
  }

  async validate(data: JwtPayload) {
    const user = await this.userModel.findOne({
      _id: data.sub,
      email: data.email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
