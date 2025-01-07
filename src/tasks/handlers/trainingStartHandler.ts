import { Request, Response } from 'express';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const trainingStartHandler = async (
  body: any,
  req: Request,
  res: Response
) => {
  let priority = 0;
  let user = await UserModel.findOne({ _id: req.userId });
  if (user != null && user.admin) {
    priority = 200;
  }
  if (user != null && user.premiumTier) {
    priority = 100;
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
    ownerId: req.userId,
  }).save();
  const modelId = insertResult._id;
  await new QueueItemModel({ taskId: modelId, priority: priority }).save();
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
