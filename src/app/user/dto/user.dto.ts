import {
  IsEnumField,
  IsReferenceField,
  IsStringField,
} from 'src/common/decorator/decorators';
import { ApiAccessLevel } from 'src/app/auth/enums/permission.enum';
import { BasicModel } from 'src/app/base/basic.dto';
import { User } from 'src/app/user/schemas/user.schema';

export class UserModel extends BasicModel {
  @IsStringField()
  name: string;

  @IsStringField()
  email: string;

  @IsStringField()
  phoneNumber?: string;

  @IsEnumField({ type: ApiAccessLevel })
  accessLevel: ApiAccessLevel;

  @IsStringField({ required: false })
  profile?: string;

  @IsStringField({ required: false })
  city?: string;
}

export class SetProfileModel {
  @IsReferenceField({ type: UserModel })
  user: User;

  @IsStringField()
  token: string;
}
