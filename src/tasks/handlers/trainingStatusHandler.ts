import { Request, Response } from 'express';
import { TaskModel } from 'mongooseSchemas/task.schema';
import { Types } from 'mongoose';

export const trainingStatusHandler = async (
  taskId: Types.ObjectId,
  req: Request,
  res: Response
) => {
  const task = await TaskModel.findOne({ _id: taskId });
  if (task === null) {
    return res
      .status(404)
      .send({ message: 'Model with that id does not exist.' });
  }
  if (task.ownerId.toString() !== req.userId?.toString()) {
    return res.status(403).send({ message: 'Not authorized.' });
  }

  return res.status(200).send({
    task: {
      status: task.status,
      output: task.output,
      dateQueued: task.dateQueued,
      dateStarted: task.dateStarted,
      dateFinished: task.dateFinished,
      projectId: task.projectId,
      ownerId: task.ownerId,
    },
  });
};
