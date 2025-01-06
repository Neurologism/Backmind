import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';
import mongoose from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({
    type: String,
    enum: ['queued', 'training', 'finished', 'error', 'stopped'],
    required: true,
  })
  status!: string;

  @Prop({ type: Array, required: true, default: [] })
  output!: any[];

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  task!: any;

  @Prop({ type: Date, required: true, default: () => new Date() })
  datelastUpdated!: Date;

  @Prop({ type: Date })
  dateQueued?: Date;

  @Prop({ type: Date })
  dateStarted?: Date;

  @Prop({ type: Date })
  dateFinished?: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: 'projects' })
  projectId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  ownerId!: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.pre('save', function (next) {
  this.datelastUpdated = new Date();
  next();
});

export const TaskModel = mongoose.model('tasks', TaskSchema);
