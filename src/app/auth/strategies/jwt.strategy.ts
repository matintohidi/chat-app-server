import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/app/auth/dto/jwt.dto';
import { User } from 'src/app/user/schemas/user.schema';
import { AuthStrategies } from 'src/app/auth/enums/jwt.enum';
import { JWT_SECRET } from 'src/configs/app.config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.JWT,
) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(data: JwtPayload): Promise<User> {
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
