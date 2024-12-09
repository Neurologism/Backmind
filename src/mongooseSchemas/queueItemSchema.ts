import mongoose from 'mongoose';

const mongooseQueueItemSchema = new mongoose.Schema({
  taskId: { type: mongoose.Types.ObjectId, required: true },
  queuePosition: Number, // muss auch im worker beim requeuen gesetzt werden
});

export const QueueItemModel = mongoose.model(
  'queueitems',
  mongooseQueueItemSchema
);
