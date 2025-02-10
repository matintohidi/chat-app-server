import { UserModel } from 'src/app/user/dto/user.dto';
import { User } from 'src/app/user/schemas/user.schema';
import {
  IsReferenceField,
  IsStringField,
} from 'src/common/decorator/decorators';

export class RegisterUserDto {
  @IsStringField({ required: true })
  name: string;

  @IsStringField({ required: true })
  email: string;

  @IsStringField({ required: true })
  phoneNumber: string;

  @IsStringField({ required: true })
  password: string;

  @IsStringField()
  profile?: string;

  @IsStringField()
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

  @IsReferenceField({ type: UserModel })
  user: User;
}

export class RegisterUserModel {
  @IsStringField({ required: true })
  token: string;

  @IsReferenceField({ type: UserModel })
  user: User;
}
