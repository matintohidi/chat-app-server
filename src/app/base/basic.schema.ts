import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsDateField, IsNumberField } from 'src/common/decorator/decorators';

@Schema({ versionKey: false, timestamps: true })
export class Basic extends Document {
  @IsNumberField()
  @Prop({ type: Types.ObjectId, default: null })
  createdById?: Types.ObjectId; // reference to userId

  @IsNumberField()
  @Prop({ type: Types.ObjectId, default: null })
  updatedById?: Types.ObjectId; // reference to userId

  @IsDateField()
  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  @IsDateField()
  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;
}
