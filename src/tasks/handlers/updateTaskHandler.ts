import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { UserDocument } from '../../../mongooseSchemas/user.schema';
import { UpdateTaskDto } from '../dto/updateTask.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';

export const updateTaskHandler = async (
  user: UserDocument,
  body: UpdateTaskDto
) => {
  const task = body.task;
  const taskToUpdate = await TaskModel.findOne({ _id: task._id });
  if (taskToUpdate === null) {
    throw new HttpException(
      'Task with that id does not exist.',
      HttpStatus.NOT_FOUND
    );
  }
  const project = await ProjectModel.findOne({ _id: taskToUpdate.projectId });
  if (project === null) {
    throw new HttpException(
      'Project with that id does not exist.',
      HttpStatus.NOT_FOUND
    );
  }
  if (project.ownerId.toString() !== user._id.toString()) {
    throw new HttpException('Not authorized.', HttpStatus.FORBIDDEN);
  }

  taskToUpdate.name = task.name;
  taskToUpdate.save();

  return { msg: 'Task updated successfully.' };
};
