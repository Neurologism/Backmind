import { Response, Request, NextFunction } from 'express';
import { ProjectModel } from '../mongooseSchemas/project.schema';

export const getProjectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const project = await ProjectModel.findById(req.body.project._id);

  if (project === null) {
    return res.status(404).json({
      msg: "This project doesn't exist.",
    });
  }

  if (project.visibility === 'private') {
    if (req.userId === undefined) {
      return res.status(404).json({
        msg: 'This project is private. You need to be logged in to access it. ',
      });
    }
    const isOwner = project.ownerId!.toString() === req.userId!.toString();
    const isContributor = project.contributors
      .map((contributor) => contributor.toString())
      .includes(req.userId!.toString());

    if (!isOwner && !isContributor) {
      return res.status(404).json({
        msg: 'This project is private. You do not have access to it.',
      });
    }
  }

  req.project = project;

  next();
};
