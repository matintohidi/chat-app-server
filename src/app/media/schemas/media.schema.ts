import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Basic } from 'src/app/base/basic.schema';
import { IsNumberField, IsStringField } from 'src/common/decorator/decorators';

export type MediaEntity = 'user' | 'message';

@Schema({ versionKey: false })
export class Media extends Basic {
  @IsStringField()
  url?: string;

  @Prop({ type: Types.ObjectId, default: null })
  relatedId?: Types.ObjectId;

  @IsStringField()
  @Prop({ type: String, default: null })
  downloadLink?: string;

  @IsNumberField()
  @Prop({ type: Number, default: 0 })
  downloadSize?: number;

  @IsStringField()
  @Prop({ type: String, default: null })
  relativeUrl?: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  bucket?: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  entity?: MediaEntity;

  @IsStringField()
  @Prop({ required: true, type: String })
  fileName: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  sha256?: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  md5?: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  ext?: string;

  @IsNumberField()
  @Prop({ type: Number, default: 0 })
  size?: number; // in kb

  @IsStringField()
  @Prop({ type: String, default: null })
  mimetype?: string;

  @IsStringField()
  @Prop({ type: String, default: null })
  description?: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
