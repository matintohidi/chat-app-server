import { UserRepository } from './../../user/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/app/auth/dto/jwt.dto';
import { AuthStrategies } from 'src/app/auth/enums/jwt.enum';
const { JWT_SECRET_SET_PROFILE } = process.env;

@Injectable()
export class JwtSetProfileStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.JWT_SET_PROFILE,
) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_SET_PROFILE,
    });
  }

  async validate(data: JwtPayload) {
    const user = await this.userRepository.findOne({
      _id: data.sub,
      email: data.email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
