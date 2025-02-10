import { MediaModel } from 'src/app/media/dto/media.dto';
import { StandardApiInterface } from 'src/common/decorator/standard-api.decorator';

export const Upload: StandardApiInterface = {
  type: MediaModel,
  description: 'Upload a media file to the server for storage and retrieval',
  summary: 'Upload a media file',
  version: 1,
};
