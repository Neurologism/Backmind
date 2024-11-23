import mongoose from 'mongoose';

const mongooseQueueItemSchema = new mongoose.Schema({
  task_id: mongoose.Types.ObjectId,
  queue_position: Number,
});

mongooseQueueItemSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const QueueItemModel = mongoose.model(
  'queueitems',
  mongooseQueueItemSchema
);
