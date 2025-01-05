import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Task extends Document {
  // @ts-ignore
  @Prop({
    type: String,
    enum: ['queued', 'training', 'finished', 'error', 'stopped'],
    required: true,
  })
  status!: string;

  // @ts-ignore
  @Prop({ type: Array, required: true, default: [] })
  output!: any[];

  // @ts-ignore
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  task!: any;

  // @ts-ignore
  @Prop({ type: Date, required: true, default: () => new Date() })
  datelastUpdated!: Date;

  // @ts-ignore
  @Prop({ type: Date })
  dateQueued?: Date;

  // @ts-ignore
  @Prop({ type: Date })
  dateStarted?: Date;

  // @ts-ignore
  @Prop({ type: Date })
  dateFinished?: Date;

  // @ts-ignore
  @Prop({ type: Types.ObjectId, required: true })
  projectId!: Types.ObjectId;

  // @ts-ignore
  @Prop({ type: Types.ObjectId, required: true })
  ownerId!: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.pre('save', function (next) {
  this.datelastUpdated = new Date();
  next();
});
