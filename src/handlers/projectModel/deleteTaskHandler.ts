import { Request, Response } from 'express';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';
import { QueueItemModel } from '../../mongooseSchemas/queueItemSchema';
import { TaskModel } from '../../mongooseSchemas/taskSchema';

export const deleteTaskHandler = async (req: Request, res: Response) => {
  const model = req.body.model;
  const dbProject = await ProjectModel.findOne({
    _id: req.body.project._id,
  });

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
};
