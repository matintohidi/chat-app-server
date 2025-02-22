import { BusinessController } from 'src/common/decorator/business-controller.decorator';
import { MediaService } from 'src/app/media/services/media.service';
import { GetUser } from 'src/app/auth/decorators/get-user.decorator';
import { Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiPermission } from 'src/app/auth/decorators/permission.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { StandardApi } from 'src/common/decorator/standard-api.decorator';
import { MinioService } from 'src/plugins/minio/services/minio.service';
import { User } from 'src/app/user/schemas/user.schema';
import { Bucket } from 'src/plugins/minio/enums/minio.enum';
import { ApiFile } from 'src/plugins/minio/decorators/api-file.decorator';
import { UploadQuery } from 'src/app/media/dto/media.dto';
import { Media } from 'src/app/media/schemas/media.schema';
import { Upload } from 'src/app/media/standard-api';

@BusinessController('media')
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private minioService: MinioService,
  ) {}

  @ApiPermission()
  @StandardApi(Upload)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile('file')
  @Post('upload')
  async upload(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Query() query: UploadQuery,
  ): Promise<Media> {
    const uploadedFile = await this.minioService.upload(
      {
        bucket: query.bucket || Bucket.Public,
        fileName: query.filename,
        file,
        user,
      },
      { sync: true },
    );

    const access: string[] = query.bucket === Bucket.Public ? null : [user.id];

    const result = await this.mediaService.save(
      {
        ...uploadedFile,
        fileName: query.filename || uploadedFile.fileName,
        access,
      },
      user,
    );

    return result;
  }
}
