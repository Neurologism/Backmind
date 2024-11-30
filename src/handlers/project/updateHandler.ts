import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { updateProjectAsContributorSchema } from '../../zodSchemas/projectSchemas';
import { z } from 'zod';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';

export const updateHandler = async (req: Request, res: Response) => {
  if (
    req.body.project.name !== undefined &&
    req.body.project.name !== req.project!.name
  ) {
    const nameTaken =
      (await ProjectModel.findOne({
        name: req.body.project.name,
        ownerId: req.userId,
      })) !== null;
    if (nameTaken) {
      return res.status(409).json({ msg: 'Project name already taken.' });
    }
  }

  if (!req.middlewareParams.isProjectOwner) {
    try {
      req.body = await updateProjectAsContributorSchema.parseAsync(req.body);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: JSON.parse(error.message),
          errorFriendly: error.flatten(),
        });
      } else {
        throw error;
      }
    }
  }

  const currentUser = await UserModel.findById(req.userId);

  if (req.body.project.plainPassword) {
    const passwordsMatch = bcrypt.compareSync(
      req.body.project.plainPassword,
      currentUser!.passwordHash
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The password is incorrect.' });
    }
  }

  delete req.body.project.plainPassword;
  await ProjectModel.updateOne(
    { _id: req.body.project._id },
    {
      $set: req.body.project,
    }
  );
  return res.status(200).json({ msg: 'Project changed successfully.' });
};
