import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Basic } from 'src/app/base/basic.schema';

@Schema({ timestamps: true })
export class Media extends Basic {
  @Prop()
  url?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop()
  relatedId?: number;

  @Prop()
  entity?: string;

  @Prop()
  downloadLink?: string;

  @Prop({ default: 0 })
  downloadSize?: number;

  @Prop()
  relativeUrl?: string;

  @Prop()
  bucket?: string;

  @Prop({ required: true })
  fileName: string;

  @Prop()
  sha256?: string;

  @Prop()
  md5?: string;

  @Prop()
  ext?: string;

  @Prop()
  size?: number; // in kb

  @Prop()
  mimetype?: string;

  @Prop()
  description?: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
