import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';

export const isTakenHandler = async (
  projectName: string,
  userId: Types.ObjectId
) => {
  if (!userId) {
    throw new UnauthorizedException('You need to be logged in.');
  }

  const nameTaken =
    (await ProjectModel.findOne({
      name: projectName,
      ownerId: userId,
      isTutorialProject: false,
    })) !== null;

  if (nameTaken) {
    throw new ConflictException('This project name is already in use.');
  }
  return { msg: 'This project name is available.' };
};
