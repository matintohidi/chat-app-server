import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from 'src/app/media/media.module';
import { UserController } from 'src/app/user/controllers/user.controller';
import { UserRepository } from 'src/app/user/repositories/user.repository';
import { User, UserSchema } from 'src/app/user/schemas/user.schema';
import { UserService } from 'src/app/user/services/user.service';
import { MinioModule } from 'src/plugins/minio/minio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MinioModule,
    MediaModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
