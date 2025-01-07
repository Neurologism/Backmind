import { Request, Response } from 'express';
import { ProjectModel } from 'mongooseSchemas/project.schema';
import { Types } from 'mongoose';

export const getHandler = async (
  projectId: Types.ObjectId,
  req: Request,
  res: Response
) => {
  const project = await ProjectModel.findById(projectId);

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

  project!;
  const projectJson = {
    _id: project._id,
    name: project.name,
    description: project.description,
    ownerId: project.ownerId,
    visibility: project.visibility,
    dateCreatedAt: project.dateCreatedAt,
    dateLastEdited: project.dateLastEdited,
    tasks: project.tasks,
    components: project.components,
  };
  return res.status(200).json({ project: projectJson });
};
