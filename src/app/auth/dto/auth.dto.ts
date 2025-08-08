import { UserModel } from 'src/app/user/dto/user.dto';
import { User } from 'src/app/user/schemas/user.schema';
import {
  IsReferenceField,
  IsStringField,
} from 'src/common/decorator/decorators';

export class CreateUserDto {
  @IsStringField()
  name: string;

  @IsStringField()
  email: string;

  @IsStringField()
  password: string;
}

export class UpdateUserDto {
  @IsStringField({ required: false })
  name?: string;

  @IsStringField({ required: false })
  email: string;

  @IsStringField({ required: false })
  phoneNumber?: string;

  @IsStringField({ required: false })
  password?: string;

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

  @IsReferenceField({ type: UserModel })
  user: User;
}

export class RegisterUserModel {
  @IsStringField({ required: true })
  token: string;

  @IsReferenceField({ type: UserModel })
  user: User;
}
