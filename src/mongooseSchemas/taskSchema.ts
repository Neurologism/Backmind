import mongoose from 'mongoose';

const mongooseTaskSchema = new mongoose.Schema({
  status: String,
  output: [],
  task: mongoose.Schema.Types.Mixed,
  datelastUpdated: Date,
  dateQueued: Date,
  dateStarted: Date,
  dateFinished: Date,
  projectId: mongoose.Types.ObjectId,
});

mongooseTaskSchema.pre('save', function (next) {
  this.datelastUpdated = new Date();
  next();
});

export const TaskModel = mongoose.model('tasks', mongooseTaskSchema);
