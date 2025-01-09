import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { CreateDto } from '../dto/create.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export const createHandler = async (
  userId: Types.ObjectId,
  body: CreateDto
) => {
  if (!userId) {
    throw new HttpException(
      'You need to be logged in to create a project.',
      HttpStatus.UNAUTHORIZED
    );
  }

  const nameTaken =
    (await ProjectModel.findOne({
      name: body.project.name,
      ownerId: userId,
      isTutorialProject: false,
    })) !== null;
  if (nameTaken) {
    throw new HttpException('Project name already taken.', HttpStatus.CONFLICT);
  }

  const project = new ProjectModel({
    name: body.project.name,
    description: body.project.description,
    ownerId: userId,
    visibility: body.project.visibility,
  });

  const insertResult = await project.save();
  await UserModel.updateOne(
    { _id: userId },
    {
      $push: { projectIds: insertResult._id },
    }
  );
  return {
    msg: 'Project created successfully.',
    project: { _id: insertResult._id },
  };
};
