import mongoose from 'mongoose';

const mongooseTaskSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['queued', 'training', 'finished', 'error', 'stopped'],
    required: true,
  },
  output: { type: [], required: true, default: [] },
  task: { type: mongoose.Schema.Types.Mixed, required: true },
  datelastUpdated: { type: Date, required: true, default: () => new Date() },
  dateQueued: Date,
  dateStarted: Date,
  dateFinished: Date,
  projectId: { type: mongoose.Types.ObjectId, required: true },
});

mongooseTaskSchema.pre('save', function (next) {
  this.datelastUpdated = new Date();
  next();
});

export const TaskModel = mongoose.model('tasks', mongooseTaskSchema);
