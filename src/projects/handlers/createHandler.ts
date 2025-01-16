import { UserDocument, UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { CreateDto } from '../dto/create.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const createHandler = async (user: UserDocument, body: CreateDto) => {
  const nameTaken =
    (await ProjectModel.findOne({
      name: body.project.name,
      ownerId: user._id,
      isTutorialProject: false,
    })) !== null;
  if (nameTaken) {
    throw new HttpException('Project name already taken.', HttpStatus.CONFLICT);
  }

  const project = new ProjectModel({
    name: body.project.name,
    description: body.project.description,
    ownerId: user._id,
    visibility: body.project.visibility,
  });

  const insertResult = await project.save();
  await UserModel.updateOne(
    { _id: user._id },
    {
      $push: { projectIds: insertResult._id },
    }
  );
  return {
    msg: 'Project created successfully.',
    project: { _id: insertResult._id },
  };
};
