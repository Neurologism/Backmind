import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import mongoose from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true, default: () => new Date() })
  name!: string;

  @Prop({
    enum: ['queued', 'training', 'finished', 'error', 'stopped'],
    required: true,
  })
  status!: string;

  @Prop({ required: true, default: [] })
  output!: any[];

  @Prop({ required: true, default: () => new Date() })
  dateLastUpdated!: Date;

  @Prop()
  dateQueued?: Date;

  @Prop()
  dateStarted?: Date;

  @Prop()
  dateFinished?: Date;

  @Prop({ required: true, ref: 'projects' })
  projectId!: Types.ObjectId;

  @Prop({ required: true, ref: 'nodes' })
  startNodeId!: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.pre('save', function (next) {
  this.dateLastUpdated = new Date();
  next();
});

export const TaskModel = mongoose.model('tasks', TaskSchema);
