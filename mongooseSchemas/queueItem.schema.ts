import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

export type QueueItemDocument = HydratedDocument<QueueItem>;

@Schema()
export class QueueItem {
  @Prop({ required: true, ref: 'tasks' })
  taskId!: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  priority!: number;
}

export const QueueItemSchema = SchemaFactory.createForClass(QueueItem);

export const QueueItemModel = mongoose.model('queueitems', QueueItemSchema);
