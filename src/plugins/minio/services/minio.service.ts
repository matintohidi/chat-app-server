import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
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
    const privateBucketExist = await this.minio.bucketExists(Bucket.Private);
    const publicBucketExist = await this.minio.bucketExists(Bucket.Public);

    if (!privateBucketExist) {
      await this.minio.makeBucket(Bucket.Private, 'ir');

      const privatePolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['arn:aws:iam::account-id:root'] },
            Action: [
              's3:PutObject',
              's3:AbortMultipartUpload',
              's3:DeleteObject',
              's3:GetObject',
              's3:ListMultipartUploadParts',
            ],
            Resource: [`arn:aws:s3:::${Bucket.Private}/*`],
          },
          {
            Effect: 'Deny',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: [`arn:aws:s3:::${Bucket.Private}/*`],
          },
        ],
      };

      await this.minio.setBucketPolicy(
        Bucket.Private,
        JSON.stringify(privatePolicy),
      );
    }

    if (!publicBucketExist) {
      await this.minio.makeBucket(Bucket.Public, 'ir');

      const publicPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: [
              's3:PutObject',
              's3:AbortMultipartUpload',
              's3:DeleteObject',
              's3:ListMultipartUploadParts',
              's3:GetObject',
            ],
            Resource: [`arn:aws:s3:::${Bucket.Public}/*`],
          },
        ],
      };

      await this.minio.setBucketPolicy(
        Bucket.Public,
        JSON.stringify(publicPolicy),
      );
    }
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

  async getPreSignedUrl(filePath: string): Promise<string> {
    return this.minio.presignedGetObject(Bucket.Private, filePath, 600);
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

    return {
      bucket,
      ext,
      sha256,
      md5,
      fileName: name,
      mimetype: ContentType,
      relativeUrl: downloadURL,
      size: fileBuffer.length,
    };
  }

  async download(url: string) {
    const splittedURL = url.split('/');
    const path = splittedURL.slice(2, splittedURL.length).join('/');

    const bucket: Bucket = splittedURL?.at(1) as any;

    if (![Bucket.Private].includes(bucket)) {
      throw new ForbiddenException('bucket is not allowed');
    }

    const meta = await this.minio.statObject(bucket, path);
    const file = await this.minio.getObject(bucket, path);

    return { meta, file };
  }
}
