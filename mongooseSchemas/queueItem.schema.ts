import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class QueueItem extends Document {
  // @ts-ignore
  @Prop({ type: Types.ObjectId, required: true })
  taskId!: Types.ObjectId;

  // @ts-ignore
  @Prop({ type: Number, required: true, default: 0 })
  priority!: number;
}

export const QueueItemSchema = SchemaFactory.createForClass(QueueItem);
