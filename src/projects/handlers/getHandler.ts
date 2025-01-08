import { Request } from 'express';
import { ProjectModel } from 'mongooseSchemas/project.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getHandler = async (projectId: Types.ObjectId, req: Request) => {
  const project = await ProjectModel.findById(projectId);

  if (project === null) {
    throw new HttpException(
      "This project doesn't exist.",
      HttpStatus.NOT_FOUND
    );
  }

  if (project.visibility === 'private') {
    if (req.userId === undefined || req.userId === null) {
      throw new HttpException(
        'This project is private. You need to be logged in to access it.',
        HttpStatus.NOT_FOUND
      );
    }
    const isOwner = project.ownerId.toString() === req.userId.toString();
    if (!isOwner) {
      throw new HttpException(
        'This project is private. You do not have access to it.',
        HttpStatus.NOT_FOUND
      );
    }
  }

  const projectJson = {
    _id: project._id,
    name: project.name,
    description: project.description,
    ownerId: project.ownerId,
    visibility: project.visibility,
    dateCreatedAt: project.dateCreatedAt,
    dateLastEdited: project.dateLastEdited,
    tasks: project.tasks,
    components: project.components,
  };
  return { project: projectJson };
};
