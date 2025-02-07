import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from 'src/app/media/controllers/media.controller';
import { MediaRepository } from 'src/app/media/repositories/media.repository';
import { Media, MediaSchema } from 'src/app/media/schemas/media.schema';
import { MediaService } from 'src/app/media/services/media.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
})
export class MediaModule {}
