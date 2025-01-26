import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserDocument } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';

export const trainingStopHandler = async (
  taskId: Types.ObjectId,
  user: UserDocument
) => {
  const task = await TaskModel.findOne({ _id: taskId });
  if (task === null) {
    throw new HttpException(
      'Task with that id does not exist.',
      HttpStatus.NOT_FOUND
    );
  }
  const project = await ProjectModel.findOne({ _id: task.projectId });
  if (project === null) {
    throw new HttpException(
      'Project with that id does not exist.',
      HttpStatus.NOT_FOUND
    );
  }
  if (project.ownerId.toString() !== user._id.toString()) {
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
