import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from 'src/app/user/dto/user.dto';
import { JwtPayload } from 'src/app/auth/dto/jwt.dto';
import { UserRepository } from 'src/app/user/repositories/user.repository';
const { JWT_SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(data: JwtPayload): Promise<UserModel> {
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
