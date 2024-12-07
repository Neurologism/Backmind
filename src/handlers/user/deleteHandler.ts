import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';
import { TaskModel } from '../../mongooseSchemas/taskSchema';

export const deleteHandler = async (req: Request, res: Response) => {
  if (req.userId === undefined) {
    return res.status(401).send('Unauthorized');
  }

  const user = await UserModel.findById(req.userId);

  if (user === null) {
    return res.status(404).send('User not found');
  }

  const runningTask = await TaskModel.findOne({
    ownerId: req.userId,
    status: { $in: ['queued', 'training'] },
  });
  if (runningTask !== null) {
    return res.status(409).send('Cannot delete user with running tasks');
  }

  let promises = [];

  promises.push(
    ProjectModel.deleteMany({
      ownerId: req.userId,
    })
  );

  promises.push(
    TaskModel.deleteMany({
      ownerId: req.userId,
    })
  );

  promises.push(
    Promise.all(
      user.followerIds.map((followerId) =>
        UserModel.updateOne(
          { _id: followerId },
          { $pull: { followingIds: req.userId } }
        )
      )
    )
  );

  promises.push(
    Promise.all(
      user.followerIds.map((followerId) =>
        UserModel.updateOne(
          { _id: followerId },
          { $pull: { followingIds: req.userId } }
        )
      )
    )
  );

  promises.push(
    UserModel.deleteOne({
      _id: req.userId,
    })
  );

  await Promise.all(promises);

  console.log('test');

  return res.status(200).json({
    msg: 'User deleted',
  });
};
