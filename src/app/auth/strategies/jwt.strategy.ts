import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/app/auth/dto/jwt.dto';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { User } from 'src/app/user/schemas/user.schema';
import { AuthStrategies } from 'src/app/auth/enums/jwt.enum';
const { JWT_SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.JWT,
) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(data: JwtPayload): Promise<User> {
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
