import { Request, Response } from 'express';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';

export const deleteTaskHandler = async (
  body: any,
  req: Request,
  res: Response
) => {
  const model = await TaskModel.findOne({ _id: body.model._id });
  if (model === null) {
    return res
      .status(404)
      .send({ message: 'Model with that id does not exist.' });
  }
  if (model.ownerId.toString() !== req.userId?.toString()) {
    return res.status(403).send({ message: 'Not authorized.' });
  }

  if (model.status === 'queued') {
    await QueueItemModel.deleteOne({ taskId: model!._id });
  }

  await ProjectModel.updateOne(
    { _id: model.projectId },
    {
      $pull: { models: model._id },
    }
  );

  await TaskModel.deleteOne({ _id: model._id });

  res.status(200).send({ msg: 'Task deleted successfully.' });
};
