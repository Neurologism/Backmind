import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserDocument } from '../../../mongooseSchemas/user.schema';

export const deleteTaskHandler = async (
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
  if (task.ownerId.toString() !== user._id.toString()) {
    throw new HttpException('Not authorized.', HttpStatus.FORBIDDEN);
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

  return { msg: 'Task deleted successfully.' };
};
