import { OmitType } from '@nestjs/swagger';
import { UserModel } from 'src/app/user/DTOs/user.dto';
import { User } from 'src/app/user/schemas/user.schema';
import { IsStringField } from 'src/common/decorators';

export class RegisterUserDto extends OmitType(User, ['_id', 'accessLevel']) {
  @IsStringField({ required: true })
  name: string;

  @IsStringField({ required: true })
  email: string;

  @IsStringField({ required: true })
  phoneNumber: string;

  @IsStringField({ required: true })
  password: string;

  @IsStringField({ required: false })
  profile?: string;

  @IsStringField({ required: false })
  city?: string;
}

export class LoginUserDto {
  @IsStringField({ required: true })
  email: string;

  @IsStringField({ required: true })
  password: string;
}

export class LoginUserModel {
  @IsStringField({ required: true })
  token: string;

  user: UserModel;
}
