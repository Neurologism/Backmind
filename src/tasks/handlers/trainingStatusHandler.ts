import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserDocument } from '../../../mongooseSchemas/user.schema';

export const trainingStatusHandler = async (
  taskId: Types.ObjectId,
  user: UserDocument
) => {
  const task = await TaskModel.findOne({ _id: taskId });
  if (task === null) {
    throw new HttpException(
      'Model with that id does not exist.',
      HttpStatus.NOT_FOUND
    );
  }
  if (task.ownerId.toString() !== user._id.toString()) {
    throw new HttpException('Not authorized.', HttpStatus.FORBIDDEN);
  }

  return {
    task: {
      status: task.status,
      output: task.output,
      dateQueued: task.dateQueued,
      dateStarted: task.dateStarted,
      dateFinished: task.dateFinished,
      projectId: task.projectId,
      ownerId: task.ownerId,
    },
  };
};
