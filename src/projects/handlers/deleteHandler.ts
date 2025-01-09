import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import {
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const deleteHandler = async (
  projectId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  if (!userId) {
    throw new UnauthorizedException(
      'You need to be authenticated to access this resource.'
    );
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
  });

  if (!project) {
    throw new NotFoundException(
      "There is no project with that id or you don't have access to it."
    );
  }

  const isProjectOwner = project.ownerId?.toString() === userId.toString();

  if (!isProjectOwner) {
    throw new HttpException(
      'You are not the owner of this project.',
      HttpStatus.UNAUTHORIZED
    );
  }

  const promises = [];

  // currently not deleting queued tasks, but worker handles this
  promises.push(ProjectModel.deleteOne({ _id: project._id }));
  promises.push(TaskModel.deleteMany({ projectId: project._id }));
  promises.push(
    UserModel.updateOne(
      { _id: userId },
      {
        $pull: { projectIds: project._id },
      }
    )
  );
  await Promise.all(promises);

  return { msg: 'Project deleted successfully.' };
};
