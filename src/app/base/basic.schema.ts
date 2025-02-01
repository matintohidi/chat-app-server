import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsDateField, IsNumberField } from 'src/common/decorators';

export type BasicDocument = Basic & Document;

@Schema({ versionKey: false, timestamps: true })
export class Basic extends Document {
  @IsNumberField()
  @Prop({ required: false, type: Number, default: null })
  createdById?: number; // reference to userId

  @IsNumberField()
  @Prop({ required: false, type: Number, default: null })
  updatedById?: number; // reference to userId

  @IsNumberField()
  @Prop({ required: false, type: Number, default: null })
  deletedById?: number; // reference to userId

  @IsDateField()
  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  @IsDateField()
  @Prop({ required: false, type: Date, default: Date.now })
  updatedAt?: Date;

  @IsDateField()
  @Prop({ required: false, type: Date, default: null })
  deletedAt?: Date;
}
