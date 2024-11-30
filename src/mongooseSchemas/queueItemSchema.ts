import mongoose from 'mongoose';

const mongooseQueueItemSchema = new mongoose.Schema({
  taskId: mongoose.Types.ObjectId,
  queuePosition: Number,
});

export const QueueItemModel = mongoose.model(
  'queueitems',
  mongooseQueueItemSchema
);
