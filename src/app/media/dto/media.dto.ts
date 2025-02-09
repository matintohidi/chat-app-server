import { Media } from 'src/app/media/schemas/media.schema';
import { IsStringField } from 'src/common/decorator/decorators';

export class UploadQuery {
  @IsStringField()
  filename: string;
}

export class MediaModel extends Media {
  @IsStringField()
  url?: string;
}
