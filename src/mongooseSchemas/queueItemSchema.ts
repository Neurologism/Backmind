import mongoose from 'mongoose';

const mongooseQueueItemSchema = new mongoose.Schema({
  taskId: { type: mongoose.Types.ObjectId, required: true },
  priority: { type: Number, required: true, default: 0 },
});

export const QueueItemModel = mongoose.model(
  'queueitems',
  mongooseQueueItemSchema
);
