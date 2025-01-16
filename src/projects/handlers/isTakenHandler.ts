import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { ConflictException } from '@nestjs/common';
import { UserDocument } from '../../../mongooseSchemas/user.schema';

export const isTakenHandler = async (
  projectName: string,
  user: UserDocument
) => {
  const nameTaken =
    (await ProjectModel.findOne({
      name: projectName,
      ownerId: user._id,
      isTutorialProject: false,
    })) !== null;

  if (nameTaken) {
    throw new ConflictException('This project name is already in use.');
  }
  return { msg: 'This project name is available.' };
};
