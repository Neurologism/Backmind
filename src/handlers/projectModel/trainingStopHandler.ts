import { Request, Response } from 'express';
import { QueueItemModel } from '../../mongooseSchemas/queueItemSchema';
import { TaskModel } from '../../mongooseSchemas/taskSchema';

export const trainingStopHandler = async (req: Request, res: Response) => {
  const model = req.body.model;

  if (model.status === 'queued') {
    await QueueItemModel.deleteOne({ taskId: model!._id });
  }

  await TaskModel.updateOne(
    { _id: model._id },
    {
      $set: {
        status: 'stopped',
        datelastUpdated: new Date(),
        dateFinished: new Date(),
      },
    }
  );

  res.status(200).send({ msg: 'Model training stopped.' });
};
