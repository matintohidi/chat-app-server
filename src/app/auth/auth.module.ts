import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/app/auth/controllers/auth.controller';
import { JwtStrategy } from 'src/app/auth/strategies/jwt.strategy';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserModule } from 'src/app/user/user.module';
import { JwtSetProfileStrategy } from 'src/app/auth/strategies/jwt-set-profile.strategy';
import { AuthStrategies } from 'src/app/auth/enums/jwt.enum';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: AuthStrategies.JWT }),
    JwtModule.register({
      global: true,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtSetProfileStrategy],
  exports: [],
})
export class AuthModule {}
