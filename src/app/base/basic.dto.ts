import { IsStringField } from 'src/common/decorator/decorators';

export class BasicModel {
  @IsStringField()
  _id?: string;

  @IsStringField()
  createdById?: string;

  @IsStringField()
  updatedById?: string;

  @IsStringField()
  deletedById?: string;

  @IsStringField()
  createdAt?: string;

  @IsStringField()
  updatedAt?: string;

  @IsStringField()
  deletedAt?: string;
}
