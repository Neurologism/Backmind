import { Request, Response, NextFunction } from 'express';
import { ProjectModel } from '../mongooseSchemas/projectSchema';

export const accessProjectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user_id === null) {
    return res.status(400).json({
      msg: 'You need to provide an auth token.',
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
    dbProject.owner_id!.toString() === req.user_id!.toString();

  const canUpdateProject =
    isProjectOwner ||
    (() => {
      for (const contributor of dbProject.contributors) {
        if (contributor._id.toString() === req.user_id?.toString()) {
          return true;
        }
        return false;
      }
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
