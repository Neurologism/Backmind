import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';
import { TaskModel } from '../../mongooseSchemas/taskSchema';

export const deleteHandler = async (req: Request, res: Response) => {
  if (req.userId === undefined) {
    return res.status(401).send('Unauthorized');
  }

  const user = UserModel.findById(req.userId);

  if (user === null) {
    return res.status(404).send('User not found');
  }

  const projects = await ProjectModel.find({ ownerId: req.userId });

  projects.forEach((project) => {
    TaskModel.deleteMany({ projectId: project._id });
  });
};
