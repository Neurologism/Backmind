import { Request, Response } from 'express';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';

export const deleteTaskHandler = async (req: Request, res: Response) => {
  const model = req.body.model;

  if (model.status === 'queued') {
    await QueueItemModel.deleteOne({ taskId: model!._id });
  }

  await ProjectModel.updateOne(
    { _id: req.body.project._id },
    {
      $pull: { models: model._id },
    }
  );

  await TaskModel.deleteOne({ _id: model._id });

  res.status(200).send({ msg: 'Task deleted successfully.' });
};
