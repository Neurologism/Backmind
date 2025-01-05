import { Request, Response } from 'express';

export const getHandler = async (body: any, req: Request, res: Response) => {
  req.project!;
  const projectJson = {
    _id: req.project!._id,
    name: req.project!.name,
    description: req.project!.description,
    ownerId: req.project!.ownerId,
    contributors: req.project!.contributors,
    visibility: req.project!.visibility,
    dateCreatedAt: req.project!.dateCreatedAt,
    dateLastEdited: req.project!.dateLastEdited,
    models: req.project!.models,
    components: req.project!.components,
  };
  return res.status(200).json({ project: projectJson });
};
