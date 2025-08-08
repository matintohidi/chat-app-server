import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from 'src/app/media/controllers/media.controller';
import { Media, MediaSchema } from 'src/app/media/schemas/media.schema';
import { MediaLoaderService } from 'src/app/media/services/loader.service';
import { MediaService } from 'src/app/media/services/media.service';
import { MinioModule } from 'src/plugins/minio/minio.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
    MinioModule,
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaLoaderService],
  exports: [MediaService],
})
export class MediaModule {}
