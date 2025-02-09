import { omitBy, isUndefined } from 'lodash';
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import {
  BusinessRepository,
  CustomSaveOptions,
} from 'src/app/base/business.repository';
import { Media } from 'src/app/media/schemas/media.schema';

export class MediaRepository extends BusinessRepository<Media> {
  constructor(@InjectModel(Media.name) private mediaModel: Model<Media>) {
    super(mediaModel);
  }

  async createAndSave(
    data: Partial<Media>,
    options?: CustomSaveOptions,
  ): Promise<Media> {
    if (isEmpty(data)) {
      throw new BadRequestException();
    }

    const clearedData = omitBy(data, isUndefined);

    const savedEntity = await this.mediaModel.create({
      createdById: options.user ? options.user._id : null,
      ...clearedData,
    });

    const result = await this.findOne({ _id: savedEntity._id });

    return result;
  }
}
