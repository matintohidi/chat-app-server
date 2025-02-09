import { IsEnumField, IsStringField } from 'src/common/decorator/decorators';
import { ApiAccessLevel } from 'src/app/auth/enums/permission.enum';
import { BasicModel } from 'src/app/base/basic.dto';

export class UserModel extends BasicModel {
  @IsStringField({ required: true })
  name: string;

  @IsStringField({ required: true })
  email: string;

  @IsStringField({ required: true })
  phoneNumber: string;

  @IsEnumField({ type: ApiAccessLevel })
  accessLevel: ApiAccessLevel;

  @IsStringField()
  profile?: string;

  @IsStringField()
  city?: string;
}
