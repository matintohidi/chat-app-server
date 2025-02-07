import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientOptions } from 'minio';
import { MinioService } from 'src/plugins/minio/services/minio.service';
import { MINIO_CONFIG, MINIO_OPTIONS } from 'src/plugins/minio/types/constants';
import { MinioOptions } from 'src/plugins/minio/types/minio.options';

@Global()
@Module({})
export class MinioModule {
  static forRoot(
    minioConfig: ClientOptions,
    minioOptions?: MinioOptions,
  ): DynamicModule {
    return {
      module: MinioModule,
      providers: [
        { provide: MINIO_CONFIG, useValue: minioConfig },
        { provide: MINIO_OPTIONS, useValue: minioOptions || null },
        MinioService,
      ],
      exports: [MinioService],
    };
  }
}
