import mongoose from 'mongoose';

const mongooseTaskSchema = new mongoose.Schema({
  status: String,
  output: [],
  task: mongoose.Schema.Types.Mixed,
  last_updated: Date,
  queued_at: Date,
  started_at: Date,
  finished_at: Date,
  project_id: mongoose.Types.ObjectId,
});

mongooseTaskSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const TaskModel = mongoose.model('tasks', mongooseTaskSchema);
