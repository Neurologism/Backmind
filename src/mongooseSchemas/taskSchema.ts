import mongoose from 'mongoose';

const mongooseTaskSchema = new mongoose.Schema({
  status: String,
  output: [],
  task: mongoose.Schema.Types.Mixed,
  lastUpdated: Date,
  dateQueuedAt: Date,
  dateStartedAt: Date,
  dateFinishedAt: Date,
  projectId: mongoose.Types.ObjectId,
});

mongooseTaskSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

export const TaskModel = mongoose.model('tasks', mongooseTaskSchema);
