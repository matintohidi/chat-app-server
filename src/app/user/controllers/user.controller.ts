import { Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { GetUser } from 'src/app/auth/decorators/get-user.decorator';
import { ApiPermission } from 'src/app/auth/decorators/permission.decorator';
import { ApiAccessLevel } from 'src/app/auth/enums/permission.enum';
import { MediaService } from 'src/app/media/services/media.service';
import { User } from 'src/app/user/schemas/user.schema';
import { UserService } from 'src/app/user/services/user.service';
import { UploadProfile } from 'src/app/user/standard-api';
import { BusinessController } from 'src/common/decorator/business-controller.decorator';
import { StandardApi } from 'src/common/decorator/standard-api.decorator';
import { ApiFile } from 'src/plugins/minio/decorators/api-file.decorator';
import { Bucket } from 'src/plugins/minio/enums/minio.enum';
import { MinioService } from 'src/plugins/minio/services/minio.service';

@BusinessController('user')
export class UserController {
  constructor(
    private userService: UserService,
    private minioService: MinioService,
    private mediaService: MediaService,
  ) {}

  @ApiPermission([ApiAccessLevel.USER])
  @StandardApi(UploadProfile)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile('file')
  @Post('upload-profile')
  async uploadProfile(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadedFile = await this.minioService.upload(
      {
        bucket: Bucket.Public,
        fileName: user.name,
        file,
        user,
      },
      {
        sync: true,
      },
    );

    const result = await this.mediaService.save(
      {
        ...uploadedFile,
        fileName: user.name || uploadedFile.fileName,
      },
      user,
    );

    return result;
  }
}
