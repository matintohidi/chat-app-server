import { Types } from 'mongoose';
import { IsStringField } from 'src/common/decorator/decorators';

export class BasicModel {
  @IsStringField()
  _id?: Types.ObjectId;

  @IsStringField()
  createdById?: Types.ObjectId;

  @IsStringField()
  updatedById?: Types.ObjectId;

  @IsStringField()
  createdAt?: string;

  @IsStringField()
  updatedAt?: string;
}
