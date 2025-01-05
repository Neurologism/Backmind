import { Request, Response, NextFunction } from 'express';
import { ProjectModel } from '../mongooseSchemas/project.schema';

export const accessProjectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.userId === undefined) {
    return res.status(400).json({
      msg: 'You need to be authenticated to access this resource.',
    });
  }

  const dbProject = await ProjectModel.findOne({
    _id: req.body.project._id,
  });

  const projectExists = dbProject !== null;
  if (!projectExists) {
    return res.status(404).json({
      msg: "There is no project with that id or you don't have access to it.",
    });
  }

  const isProjectOwner =
    dbProject.ownerId!.toString() === req.userId!.toString();

  const canUpdateProject =
    isProjectOwner ||
    (() => {
      for (const contributor of dbProject.contributors) {
        if (contributor._id.toString() === req.userId?.toString()) {
          return true;
        }
      }
      return false;
    })();
  if (!canUpdateProject) {
    return res.status(404).json({
      msg: "There is no project with that id or you don't have access to it.",
    });
  }

  req.project = dbProject;
  req.middlewareParams = { isProjectOwner, canUpdateProject };

  next();
};
