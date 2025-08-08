import { Injectable, NotFoundException } from '@nestjs/common';
import { Media } from 'src/app/media/schemas/media.schema';
import { MediaLoaderService } from 'src/app/media/services/loader.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<Media>,
    private mediaLoaderService: MediaLoaderService,
  ) {}

  async save(media: Partial<Media>): Promise<Media> {
    const isExist = await this.mediaModel.findOne({
      relativeUrl: media.relativeUrl,
    });

    if (isExist) {
      return isExist;
    }

    const mediaCreated = await this.mediaModel.create(media);

    this.mediaLoaderService.baseUrlHandler(mediaCreated);

    return mediaCreated;
  }

  async update(id: Types.ObjectId, data: Partial<Media>) {
    const media = await this.mediaModel.findByIdAndUpdate(id, data);

    if (!media) {
      throw new NotFoundException();
    }
  }

  async delete(id: Types.ObjectId) {
    const media = await this.mediaModel.findByIdAndDelete(id);

    if (!media) {
      throw new NotFoundException();
    }
  }
}
