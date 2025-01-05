import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class QueueItem extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  taskId!: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  priority!: number;
}

export const QueueItemSchema = SchemaFactory.createForClass(QueueItem);
