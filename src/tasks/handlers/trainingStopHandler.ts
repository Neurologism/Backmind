import { Request } from 'express';
import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const trainingStopHandler = async (
  taskId: Types.ObjectId,
  req: Request
) => {
  const task = await TaskModel.findOne({ _id: taskId });
  if (task === null) {
    throw new HttpException(
      'Task with that id does not exist.',
      HttpStatus.NOT_FOUND
    );
  }
  if (task.ownerId.toString() !== req.userId?.toString()) {
    throw new HttpException('Not authorized.', HttpStatus.FORBIDDEN);
  }

  if (task.status === 'queued') {
    await QueueItemModel.deleteOne({ taskId: task._id });
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

  return { msg: 'Task training stopped.' };
};
