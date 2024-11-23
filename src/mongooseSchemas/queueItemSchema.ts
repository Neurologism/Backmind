import mongoose from 'mongoose';

const mongooseQueueItemSchema = new mongoose.Schema({
  model_id: mongoose.Types.ObjectId,
  queue_position: Number
});

export const QueueItemModel = mongoose.model(
  'TrainingQueue',
  mongooseQueueItemSchema
);
