import { Request } from 'express';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { QueueItemModel } from '../../../mongooseSchemas/queueItem.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import {
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TrainingStartDto } from '../dto/trainingStart.schema';

export const trainingStartHandler = async (
  body: TrainingStartDto,
  req: Request
) => {
  if (!req.userId) {
    throw new UnauthorizedException(
      'You need to be authenticated to access this resource.'
    );
  }

  const project = await ProjectModel.findOne({
    _id: body.project._id,
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
    throw new HttpException(
      'You are not the owner of this project.',
      HttpStatus.UNAUTHORIZED
    );
  }

  let priority = 0;
  let user = await UserModel.findOne({ _id: req.userId });
  if (user != null && user.admin) {
    priority = 200;
  }
  if (user != null && user.premiumTier) {
    priority = 100;
  }
  const insertResult = await new TaskModel({
    status: 'queued',
    output: [],
    task: project.components,
    datelastUpdated: new Date(),
    dateQueued: new Date(),
    dateStarted: null,
    dateFinished: null,
    projectId: project._id,
    ownerId: req.userId,
  }).save();
  const taskId = insertResult._id;
  await new QueueItemModel({ taskId: taskId, priority: priority }).save();
  await ProjectModel.updateOne(
    { _id: project._id },
    {
      $push: { tasks: taskId },
    }
  );

  return { task: { _id: taskId }, msg: 'Model training queued.' };
};
