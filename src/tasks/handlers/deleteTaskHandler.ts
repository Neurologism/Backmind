import { Request, Response } from 'express';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { Types } from 'mongoose';

export const deleteTaskHandler = async (
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
    await QueueItemModel.deleteOne({ taskId: task._id });
  }

  await ProjectModel.updateOne(
    { _id: task.projectId },
    {
      $pull: { tasks: task._id },
    }
  );

  await TaskModel.deleteOne({ _id: task._id });

  res.status(200).send({ msg: 'Task deleted successfully.' });
};
