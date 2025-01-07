import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

export const deleteHandler = async (
  projectId: string,
  req: Request,
  res: Response
) => {
  if (!req.userId) {
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

  const isProjectOwner = project.ownerId?.toString() === req.userId.toString();

  if (!isProjectOwner) {
    throw new NotFoundException(
      "There is no project with that id or you don't have access to it."
    );
  }

  if (isProjectOwner) {
    return res
      .status(401)
      .json({ msg: 'You are not the owner of this project.' });
  }

  const promises = [];

  // currently not deleting queued tasks, but worker handles this
  promises.push(ProjectModel.deleteOne({ _id: project._id }));
  promises.push(TaskModel.deleteMany({ projectId: project._id }));
  promises.push(
    UserModel.updateOne(
      { _id: req.userId },
      {
        $pull: { projectIds: project._id },
      }
    )
  );
  await Promise.all(promises);

  return res.status(200).json({ msg: 'Project deleted successfully.' });
};
