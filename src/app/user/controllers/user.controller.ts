import { Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { GetUser } from 'src/app/auth/decorators/get-user.decorator';
import { ApiPermission } from 'src/app/auth/decorators/permission.decorator';
import { ApiAccessLevel } from 'src/app/auth/enums/permission.enum';
import { MediaService } from 'src/app/media/services/media.service';
import { User } from 'src/app/user/schemas/user.schema';
import { UserService } from 'src/app/user/services/user.service';
import { SetProfile, UpdateProfile } from 'src/app/user/standard-api';
import { BasicController } from 'src/common/decorator/basic-controller.decorator';
import { StandardApi } from 'src/common/decorator/standard-api.decorator';
import { ApiFile } from 'src/plugins/minio/decorators/api-file.decorator';
import { Bucket } from 'src/plugins/minio/enums/minio.enum';
import { MinioService } from 'src/plugins/minio/services/minio.service';
import * as sharp from 'sharp';
import { Types } from 'mongoose';
import { AuthStrategies } from 'src/app/auth/enums/jwt.enum';
import { JwtPayload } from 'src/app/auth/dto/jwt.dto';
import { EXPIRES_IN, JWT_SECRET } from 'src/configs/app.config';
import { JwtService } from '@nestjs/jwt';
import { SetProfileModel } from 'src/app/user/dto/user.dto';

@BasicController('user')
export class UserController {
  constructor(
    private userService: UserService,
    private minioService: MinioService,
    private mediaService: MediaService,
    private jwtService: JwtService,
  ) {}

  @ApiPermission([ApiAccessLevel.USER])
  @StandardApi(UpdateProfile)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile('file')
  @Post('upload-profile')
  async uploadProfile(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const resizedAndConvertedBuffer = await sharp(file.buffer)
      .resize(1000, 1000, { withoutEnlargement: true })
      .toFormat('webp')
      .webp({ quality: 90 })
      .toBuffer();

    const uploadedFile = await this.minioService.upload(
      {
        bucket: Bucket.Public,
        file,
        buffer: resizedAndConvertedBuffer,
        user,
      },
      {
        sync: true,
      },
    );

    const media = await this.mediaService.save({
      ...uploadedFile,
      fileName: uploadedFile.fileName,
      entity: 'user',
      relatedId: user._id as Types.ObjectId,
    });

    const updatedUser = await this.userService.update(
      user._id as Types.ObjectId,
      {
        profile: media.url,
      },
    );

    return updatedUser;
  }

  @ApiPermission([ApiAccessLevel.USER], {
    authStrategy: AuthStrategies.JWT_SET_PROFILE,
  })
  @StandardApi(SetProfile)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile('file')
  @Post('set-profile')
  async setProfile(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SetProfileModel> {
    const resizedAndConvertedBuffer = await sharp(file.buffer)
      .resize(1000, 1000, { withoutEnlargement: true })
      .toFormat('webp')
      .webp({ quality: 90 })
      .toBuffer();

    const uploadedFile = await this.minioService.upload(
      {
        bucket: Bucket.Public,
        file,
        buffer: resizedAndConvertedBuffer,
        user,
      },
      {
        sync: true,
      },
    );

    const media = await this.mediaService.save({
      ...uploadedFile,
      fileName: uploadedFile.fileName,
      entity: 'user',
      relatedId: user._id as Types.ObjectId,
    });

    const updatedUser = await this.userService.update(
      user._id as Types.ObjectId,
      {
        profile: media.url,
      },
    );

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: EXPIRES_IN,
      secret: JWT_SECRET,
    });

    return {
      token,
      user: updatedUser,
    };
  }
}
