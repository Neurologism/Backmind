import { Request, Response } from 'express';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';

export const isTakenHandler = async (req: Request, res: Response) => {
  const isLoggedIn = req.userId !== null;
  if (!isLoggedIn) {
    return res.status(401).json({ msg: 'You need to be logged in.' });
  }

  const nameTaken =
    (await ProjectModel.findOne({
      name: req.body.project.name,
      ownerId: req.userId,
    })) !== null;

  if (nameTaken) {
    return res
      .status(409)
      .json({ msg: 'This project name is already in use.' });
  }
  return res.status(200).json({ msg: 'This project name is available.' });
};
