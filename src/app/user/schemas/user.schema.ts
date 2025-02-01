import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Basic } from 'src/app/base/basic.schema';
import { IsStringField } from 'src/common/decorators';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User extends Basic {
  @IsStringField({ required: true })
  @Prop({ required: true, type: String, minlength: 3, maxlength: 20 })
  name: string;

  @IsStringField({ required: true })
  @Prop({ required: true, type: String, unique: true })
  email: string;

  @IsStringField({ required: true })
  @Prop({ required: true, type: String, minlength: 8 })
  password: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  profile?: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  phone?: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  city?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
