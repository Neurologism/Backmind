import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { UpdateDto } from '../dto/update.schema';

export const updateHandler = async (
  projectId: Types.ObjectId,
  body: UpdateDto,
  req: Request,
  res: Response
) => {
  if (!req.userId) {
    throw new UnauthorizedException(
      'You need to be authenticated to access this resource.'
    );
  }

  const project = await ProjectModel.findOne({
    _id: projectId,
  });

  if (!project) {
    throw new NotFoundException(
      "There is no project with that id or you don't have access to it."
    );
  }

  const isProjectOwner = project.ownerId?.toString() === req.userId.toString();

  if (!isProjectOwner) {
    throw new NotFoundException(
      "There is no project with that id or you don't have access to it."
    );
  }

  if (isProjectOwner) {
    return res
      .status(401)
      .json({ msg: 'You are not the owner of this project.' });
  }

  if (body.project.name !== undefined && body.project.name !== project.name) {
    const nameTaken =
      (await ProjectModel.findOne({
        name: body.project.name,
        ownerId: req.userId,
        isTutorialProject: false,
      })) !== null;
    if (nameTaken) {
      return res.status(409).json({ msg: 'Project name already taken.' });
    }
  }

  if (!isProjectOwner) {
    return res
      .status(403)
      .json({ msg: 'You are not the owner of this project.' });
  }

  const currentUser = await UserModel.findById(req.userId);

  if (!currentUser) {
    return res.status(404).json({ msg: 'User not found.' });
  }

  if (body.project.plainPassword) {
    const passwordsMatch = bcrypt.compareSync(
      body.project.plainPassword,
      currentUser.passwordHash
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The password is incorrect.' });
    }
  }

  delete body.project.plainPassword;
  await ProjectModel.updateOne(
    { _id: projectId },
    {
      $set: body.project,
    }
  );
  return res.status(200).json({ msg: 'Project changed successfully.' });
};
