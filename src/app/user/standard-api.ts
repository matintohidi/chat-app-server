import { SetProfileModel, UserModel } from 'src/app/user/dto/user.dto';
import { StandardApiInterface } from 'src/common/decorator/standard-api.decorator';

export const UpdateProfile: StandardApiInterface = {
  type: UserModel,
  description: 'Update the profile picture for the user account',
  summary: 'Update profile picture',
  version: 1,
};

export const SetProfile: StandardApiInterface = {
  type: SetProfileModel,
  description: 'Upload a profile picture for the user account',
  summary: 'Upload a profile picture',
  version: 1,
};
