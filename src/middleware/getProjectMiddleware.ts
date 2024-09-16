import { Response, Request, NextFunction } from 'express';
import { ProjectExplicit } from '../types';

export const getProjectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const project = (await req.dbProjects!.findOne({
    _id: req.body.project._id,
  })) as ProjectExplicit;

  if (project === null) {
    return res.status(404).json({
      msg: "This project doesn't exist.",
    });
  }

  if (project.visibility === 'private') {
    if (req.user_id === null) {
      return res.status(404).json({
        msg: 'This project is private. You need to be logged in to access it. ',
      });
    }
    const isOwner = project.owner_id.toString() === req.user_id!.toString();
    const isContributor = project.contributors
      .map((contributor) => contributor.toString())
      .includes(req.user_id!.toString());

    if (!isOwner && !isContributor) {
      return res.status(404).json({
        msg: 'This project is private. You do not have access to it.',
      });
    }
  }

  req.project = project;

  next();
};
