import { Request, Response } from 'express';
import { ProjectModel } from 'mongooseSchemas/project.schema';

export const getHandler = async (body: any, req: Request, res: Response) => {
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
    if (!isOwner) {
      return res.status(404).json({
        msg: 'This project is private. You do not have access to it.',
      });
    }
  }

  req.project = project;

  req.project!;
  const projectJson = {
    _id: req.project!._id,
    name: req.project!.name,
    description: req.project!.description,
    ownerId: req.project!.ownerId,
    visibility: req.project!.visibility,
    dateCreatedAt: req.project!.dateCreatedAt,
    dateLastEdited: req.project!.dateLastEdited,
    models: req.project!.models,
    components: req.project!.components,
  };
  return res.status(200).json({ project: projectJson });
};
