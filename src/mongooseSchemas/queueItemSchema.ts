import mongoose from 'mongoose';

const mongooseQueueItemSchema = new mongoose.Schema({
  taskId: { type: mongoose.Types.ObjectId, required: true },
  queuePosition: Number,
});

export const QueueItemModel = mongoose.model(
  'queueitems',
  mongooseQueueItemSchema
);
