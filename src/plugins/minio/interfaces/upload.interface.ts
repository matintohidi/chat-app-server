import { User } from 'src/app/user/schemas/user.schema';
import { Bucket } from '../enums/minio.enum';

export interface UploadParam {
  user?: User;
  bucket: Bucket;
  file?: Express.Multer.File;
  buffer?: Buffer;
  fileName?: string;
  mimeType?: string;
}
