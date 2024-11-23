import mongoose from 'mongoose';

const mongooseQueueItemSchema = new mongoose.Schema({
  model_id: mongoose.Types.ObjectId,
});

export const QueueItemModel = mongoose.model(
  'TrainingQueue',
  mongooseQueueItemSchema
);
