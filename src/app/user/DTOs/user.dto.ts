import { OmitType } from '@nestjs/swagger';
import { User } from './../schemas/user.schema';

export class UserModel extends OmitType(User, ['password']) {}
