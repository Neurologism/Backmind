import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
// import fs from 'fs';

export const updateHandler = async (body: any, req: Request, res: Response) => {
  if (
    body.project.name !== undefined &&
    body.project.name !== req.project!.name
  ) {
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

  if (!req.middlewareParams.isProjectOwner) {
    return res
      .status(403)
      .json({ msg: 'You are not the owner of this project.' });
  }

  const currentUser = await UserModel.findById(req.userId);

  if (body.project.plainPassword) {
    const passwordsMatch = bcrypt.compareSync(
      body.project.plainPassword,
      currentUser!.passwordHash
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The password is incorrect.' });
    }
  }

  delete body.project.plainPassword;
  await ProjectModel.updateOne(
    { _id: body.project._id },
    {
      $set: body.project,
    }
  );
  // Write body.project.components to a JSON file
  // fs.writeFileSync(
  //   `./project_${body.project._id}.json`,
  //   JSON.stringify(body.project.components, null, 2)
  // );
  return res.status(200).json({ msg: 'Project changed successfully.' });
};
