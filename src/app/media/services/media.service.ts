import { Injectable } from '@nestjs/common';
import { Media } from 'src/app/media/schemas/media.schema';
import { MediaRepository } from 'src/app/media/repositories/media.repository';
import { User } from 'src/app/user/schemas/user.schema';
import { MediaLoaderService } from 'src/app/media/services/loader.service';
import { FilterQuery, Types } from 'mongoose';
import { CustomSaveOptions } from 'src/app/base/basic.repository';

@Injectable()
export class MediaService {
  constructor(
    private mediaRepository: MediaRepository,
    private mediaLoaderService: MediaLoaderService,
  ) {}

  async save(media: Partial<Media>, user: User): Promise<Media> {
    const isExist = await this.findOne({ relativeUrl: media.relativeUrl });

    if (isExist) {
      return isExist;
    }

    const result = await this.mediaRepository.createAndSave(
      {
        ...media,
      },
      { user },
    );

    this.mediaLoaderService.baseUrlHandler(result);

    return result;
  }

  async findOne(input: FilterQuery<Media>): Promise<Media | null> {
    const media = await this.mediaRepository.findOne(input);

    if (media) {
      this.mediaLoaderService.baseUrlHandler(media);
    }

    return media;
  }

  async update(
    id: Types.ObjectId,
    data: Partial<Media>,
    options?: CustomSaveOptions,
  ) {
    return await this.mediaRepository.updateById(id, data, options);
  }

  async delete(id: Types.ObjectId) {
    return await this.mediaRepository.softDelete(id);
  }
}
