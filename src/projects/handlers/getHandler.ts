import { ProjectModel } from 'mongooseSchemas/project.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getHandler = async (
  projectId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const project = await ProjectModel.findById(projectId);

  if (project === null) {
    throw new HttpException(
      "This project doesn't exist.",
      HttpStatus.NOT_FOUND
    );
  }

  if (project.visibility === 'private') {
    if (userId === undefined || userId === null) {
      throw new HttpException(
        'This project is private. You need to be logged in to access it.',
        HttpStatus.NOT_FOUND
      );
    }
    const isOwner = project.ownerId.toString() === userId.toString();
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
    isTutorialProject: project.isTutorialProject,
  };
  return { project: projectJson };
};
