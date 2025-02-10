import { MediaModel } from 'src/app/media/dto/media.dto';
import { StandardApiInterface } from 'src/common/decorator/standard-api.decorator';

export const UploadProfile: StandardApiInterface = {
  type: MediaModel,
  description: 'Upload a profile picture for the user account',
  summary: 'Upload a profile picture',
  version: 1,
};
