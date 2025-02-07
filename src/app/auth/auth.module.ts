import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/app/auth/controllers/auth.controller';
import { JwtStrategy } from 'src/app/auth/jwt.strategy';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserModule } from 'src/app/user/user.module';
const { JWT_SECRET, EXPIRES_IN } = process.env;

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET || '',
      signOptions: { expiresIn: EXPIRES_IN || '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
