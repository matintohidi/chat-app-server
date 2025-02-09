import { BasicModel } from 'src/app/base/basic.dto';
import { IsNumberField, IsStringField } from 'src/common/decorator/decorators';

export class UploadQuery {
  @IsStringField()
  filename: string;
}

export class MediaModel extends BasicModel {
  @IsStringField()
  relatedId?: string;

  @IsStringField()
  downloadLink?: string;

  @IsNumberField()
  downloadSize?: number;

  @IsStringField()
  relativeUrl?: string;

  @IsStringField()
  bucket?: string;

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
