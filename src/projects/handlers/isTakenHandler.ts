import { Request } from 'express';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

export const isTakenHandler = async (projectName: string, req: Request) => {
  const isLoggedIn = req.userId !== null;
  if (!isLoggedIn) {
    throw new UnauthorizedException('You need to be logged in.');
  }

  const nameTaken =
    (await ProjectModel.findOne({
      name: projectName,
      ownerId: req.userId,
      isTutorialProject: false,
    })) !== null;

  if (nameTaken) {
    throw new ConflictException('This project name is already in use.');
  }
  return { msg: 'This project name is available.' };
};
