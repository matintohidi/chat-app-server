import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessRepository } from 'src/app/base/business.repository';
import { Media } from 'src/app/media/schemas/media.schema';

export class MediaRepository extends BusinessRepository<Media> {
  constructor(@InjectModel(Media.name) private mediaModel: Model<Media>) {
    super(mediaModel);
  }
}
