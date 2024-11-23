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

export const TaskModel = mongoose.model('Tasks', mongooseTaskSchema);
