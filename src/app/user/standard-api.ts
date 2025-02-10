import { UserModel } from 'src/app/user/dto/user.dto';
import { StandardApiInterface } from 'src/common/decorator/standard-api.decorator';

export const UploadProfile: StandardApiInterface = {
  type: UserModel,
  description: 'Upload a profile picture for the user account',
  summary: 'Upload a profile picture',
  version: 1,
};
