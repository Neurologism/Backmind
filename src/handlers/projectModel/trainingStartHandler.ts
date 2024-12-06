import { Request, Response } from 'express';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';
import { QueueItemModel } from '../../mongooseSchemas/queueItemSchema';
import { TaskModel } from '../../mongooseSchemas/taskSchema';

export const trainingStartHandler = async (req: Request, res: Response) => {
  if (
    (await QueueItemModel.countDocuments()) >
    Number(process.env.MAX_TRAINING_QUEUE_LENGTH)
  ) {
    return res
      .status(403)
      .send({ msg: 'Training queue is full. Try again later.' });
  }

  const insertResult = await new TaskModel({
    status: 'queued',
    output: [],
    task: req.project.components,
    datelastUpdated: new Date(),
    dateQueued: new Date(),
    dateStarted: null,
    dateFinished: null,
    projectId: req.project._id,
  }).save();
  const modelId = insertResult._id;
  await new QueueItemModel({ taskId: modelId }).save();
  await ProjectModel.updateOne(
    { _id: req.project._id },
    {
      $push: { models: modelId },
    }
  );

  res
    .status(200)
    .send({ model: { _id: modelId }, msg: 'Model training queued.' });
};
