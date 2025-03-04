import { UserDocument, UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { UpdateDto } from '../dto/update.schema';

export const updateHandler = async (
  projectId: Types.ObjectId,
  body: UpdateDto,
  user: UserDocument
) => {
  const project = await ProjectModel.findOne({
    _id: projectId,
  });
  body.project.ownerId = new Types.ObjectId(body.project.ownerId);

  if (!project) {
    throw new HttpException(
      "There is no project with that id or you don't have access to it.",
      HttpStatus.NOT_FOUND
    );
  }

  const isProjectOwner = project.ownerId?.toString() === user._id.toString();

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
        ownerId: user._id,
        isTutorialProject: false,
      })) !== null;
    if (nameTaken) {
      throw new HttpException(
        'Project name already taken.',
        HttpStatus.CONFLICT
      );
    }
  }

  const currentUser = await UserModel.findById(user._id);

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
