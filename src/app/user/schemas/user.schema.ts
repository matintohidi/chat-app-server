import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { ApiAccessLevel } from 'src/app/auth/enum/permission.enum';
import { Basic } from 'src/app/base/basic.schema';
import { IsEnumField, IsStringField } from 'src/common/decorator/decorators';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User extends Basic {
  @IsStringField()
  id?: string;

  @IsStringField({ required: true })
  @Prop({ required: true, type: String, minlength: 3, maxlength: 20 })
  name: string;

  @IsStringField({ required: true })
  @Prop({ required: true, type: String, unique: true })
  email: string;

  @IsStringField({ required: true })
  @Prop({ required: true, type: String, unique: true })
  phoneNumber: string;

  @IsStringField({ required: true })
  @Exclude()
  @Prop({ required: true, type: String, minlength: 8 })
  password: string;

  @IsEnumField({ type: ApiAccessLevel })
  @Prop({ type: String, enum: ApiAccessLevel, default: ApiAccessLevel.USER })
  accessLevel: ApiAccessLevel;

  @IsStringField()
  @Prop({ type: String, default: null })
  profile?: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  city?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
