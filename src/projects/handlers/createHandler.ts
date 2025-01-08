import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { CreateDto } from '../dto/create.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const createHandler = async (body: CreateDto, req: Request) => {
  const isLoggedIn = req.userId !== null;
  if (!isLoggedIn) {
    throw new HttpException(
      'You need to be logged in to create a project.',
      HttpStatus.UNAUTHORIZED
    );
  }

  const nameTaken =
    (await ProjectModel.findOne({
      name: body.project.name,
      ownerId: req.userId,
      isTutorialProject: false,
    })) !== null;
  if (nameTaken) {
    throw new HttpException('Project name already taken.', HttpStatus.CONFLICT);
  }

  const project = new ProjectModel({
    name: body.project.name,
    description: body.project.description,
    ownerId: req.userId,
    visibility: body.project.visibility,
  });

  const insertResult = await project.save();
  await UserModel.updateOne(
    { _id: req.userId! },
    {
      $push: { projectIds: insertResult._id },
    }
  );
  return {
    msg: 'Project created successfully.',
    project: { _id: insertResult._id },
  };
};
