import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';
import { TaskModel } from '../../mongooseSchemas/taskSchema';

export const deleteHandler = async (req: Request, res: Response) => {
  if (!req.middlewareParams.isProjectOwner) {
    return res
      .status(401)
      .json({ msg: 'You are not the owner of this project.' });
  }

  const activeModels =
    (await TaskModel.findOne({
      $and: [
        { projectId: req.project!._id },
        { status: { $in: ['queued', 'training'] } },
      ],
    })) !== null;
  if (activeModels) {
    return res.status(400).json({
      msg: 'You cannot delete a project with training in queue or in progress.',
    });
  }

  const promises = [];

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
