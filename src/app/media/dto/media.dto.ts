import { BasicModel } from 'src/app/base/basic.dto';
import { MediaEntity } from 'src/app/media/schemas/media.schema';
import {
  IsEnumField,
  IsNumberField,
  IsStringField,
} from 'src/common/decorator/decorators';
import { Bucket } from 'src/plugins/minio/enums/minio.enum';

export class UploadQuery {
  @IsStringField()
  filename?: string;

  @IsEnumField({ type: Bucket })
  bucket?: Bucket;
}

export class MediaModel extends BasicModel {
  @IsStringField()
  relatedId?: string;

  @IsStringField({ isArray: true })
  access?: string[];

  @IsStringField()
  downloadLink?: string;

  @IsNumberField()
  downloadSize?: number;

  @IsStringField()
  relativeUrl?: string;

  @IsStringField()
  bucket?: string;

  @IsStringField()
  entity?: MediaEntity;

  @IsStringField()
  fileName: string;

  @IsStringField()
  sha256?: string;

  @IsStringField()
  md5?: string;

  @IsStringField()
  ext?: string;

  @IsNumberField()
  size?: number; // in kb

  @IsStringField()
  mimetype?: string;

  @IsStringField()
  description?: string;

  @IsStringField()
  url?: string;
}
