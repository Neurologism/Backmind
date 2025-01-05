import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';

export const deleteHandler = async (body: any, req: Request, res: Response) => {
  if (!req.middlewareParams.isProjectOwner) {
    return res
      .status(401)
      .json({ msg: 'You are not the owner of this project.' });
  }

  const promises = [];

  // currently not deleting queued tasks, but worker handles this
  promises.push(ProjectModel.deleteOne({ _id: req.project!._id }));
  promises.push(TaskModel.deleteMany({ projectId: req.project!._id }));
  promises.push(
    UserModel.updateOne(
      { _id: req.userId! },
      {
        $pull: { projectIds: req.project!._id },
      }
    )
  );
  await Promise.all(promises);

  return res.status(200).json({ msg: 'Project deleted successfully.' });
};
