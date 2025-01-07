import { Request, Response } from 'express';
import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';

export const trainingStopHandler = async (
  taskId: Types.ObjectId,
  req: Request,
  res: Response
) => {
  const task = await TaskModel.findOne({ _id: taskId });
  if (task === null) {
    return res
      .status(404)
      .send({ message: 'Task with that id does not exist.' });
  }
  if (task.ownerId.toString() !== req.userId?.toString()) {
    return res.status(403).send({ message: 'Not authorized.' });
  }

  if (task.status === 'queued') {
    await QueueItemModel.deleteOne({ taskId: task!._id });
  }

  await TaskModel.updateOne(
    { _id: task._id },
    {
      $set: {
        status: 'stopped',
        datelastUpdated: new Date(),
        dateFinished: new Date(),
      },
    }
  );

  res.status(200).send({ msg: 'Task training stopped.' });
};
