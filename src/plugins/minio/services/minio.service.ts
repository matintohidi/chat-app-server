import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, ClientOptions, ItemBucketMetadata } from 'minio';
import { Bucket } from 'src/plugins/minio/enums/minio.enum';
import { UploadParam } from 'src/plugins/minio/interfaces/upload.interface';
import { MINIO_CONFIG } from 'src/plugins/minio/types/constants';
import * as crypto from 'crypto';
import { SALT } from 'src/common/config/app.config';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);

  private readonly minio: Client;

  constructor(@Inject(MINIO_CONFIG) private minioConfig: ClientOptions) {
    this.minio = new Client(this.minioConfig);
  }

  async onModuleInit() {
    this.init();
  }

  async init() {
    const storageBucketExist = await this.minio.bucketExists(Bucket.Storage);

    if (storageBucketExist) {
      return;
    }

    await this.minio.makeBucket(Bucket.Storage, 'ir');
  }

  private async UploadToMinio(
    file: Buffer,
    bucket: string,
    path: string,
    metaData: ItemBucketMetadata = {},
  ) {
    try {
      return await this.minio.putObject(
        bucket,
        path,
        file,
        file.length,
        metaData,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private makeURL(params: UploadParam & { md5: string }) {
    const { bucket, md5, file, user, fileName } = params;

    const name = fileName || file?.originalname;
    const ext = name.split('.').at(-1);

    let prefix = '';

    prefix = 'root';

    const baseURL = `/${prefix}/user-${user?.id}/${md5}.${ext}`;

    return {
      minioSaveURL: baseURL,
      downloadURL: `/${bucket}${baseURL}`,
      ext,
    };
  }

  private genFileHash(buffer: Buffer, salt: string) {
    const saltedBuffer = Buffer.concat([buffer, Buffer.from(salt)]);

    const sha256 = crypto
      .createHash('sha256')
      .update(saltedBuffer)
      .digest('hex');

    const md5 = crypto.createHash('md5').update(saltedBuffer).digest('hex');

    return {
      sha256,
      md5,
    };
  }

  async upload(params: UploadParam, config?: { sync?: boolean }) {
    const { bucket, buffer, file, fileName, mimeType, user } = params;

    const fileBuffer = buffer || file.buffer;

    const { sha256, md5 } = this.genFileHash(fileBuffer, SALT);

    const { downloadURL, ext, minioSaveURL } = this.makeURL({ ...params, md5 });

    let name = fileName || file.originalname;
    name = encodeURIComponent(name);

    const ContentType = mimeType || file?.mimetype;

    const meta = {
      'Content-Type': ContentType,
      fileName: name,
      md5,
      sha256,
      userId: user?.id || 'undefined',
      ext,
    };

    let existAlready = false;

    try {
      const stat = await this.minio.statObject(bucket, minioSaveURL);

      if (stat.etag) {
        existAlready = true;
      }
    } catch {
      existAlready = false;
    }

    if (!existAlready) {
      if (config?.sync) {
        await this.UploadToMinio(fileBuffer, bucket, minioSaveURL, meta);
      } else {
        this.UploadToMinio(fileBuffer, bucket, minioSaveURL, meta);
      }
    }

    const result = {
      bucket,
      ext,
      sha256,
      md5,
      fileName: name,
      mimetype: ContentType,
      relativeUrl: downloadURL,
      size: fileBuffer.length,
    };

    return result;
  }
}
