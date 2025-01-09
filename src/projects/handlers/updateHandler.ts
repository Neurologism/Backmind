import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { UpdateDto } from '../dto/update.schema';

export const updateHandler = async (
  projectId: Types.ObjectId,
  body: UpdateDto,
  userId: Types.ObjectId
) => {
  if (!userId) {
    throw new HttpException(
      'You need to be authenticated to access this resource.',
      HttpStatus.UNAUTHORIZED
    );
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
  });

  if (!project) {
    throw new HttpException(
      "There is no project with that id or you don't have access to it.",
      HttpStatus.NOT_FOUND
    );
  }

  const isProjectOwner = project.ownerId?.toString() === userId.toString();

  if (!isProjectOwner) {
    throw new HttpException(
      "There is no project with that id or you don't have access to it.",
      HttpStatus.FORBIDDEN
    );
  }

  if (body.project.name !== undefined && body.project.name !== project.name) {
    const nameTaken =
      (await ProjectModel.findOne({
        name: body.project.name,
        ownerId: userId,
        isTutorialProject: false,
      })) !== null;
    if (nameTaken) {
      throw new HttpException(
        'Project name already taken.',
        HttpStatus.CONFLICT
      );
    }
  }

  const currentUser = await UserModel.findById(userId);

  if (!currentUser) {
    throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
  }

  await ProjectModel.updateOne(
    { _id: projectId },
    {
      $set: body.project,
    }
  );

  return { msg: 'Project changed successfully.' };
};
