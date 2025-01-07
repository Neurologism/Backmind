import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { Types } from 'mongoose';

export const deleteHandler = async (
  userId: Types.ObjectId,
  req: Request,
  res: Response
) => {
  if (req.userId === undefined) {
    return res.status(401).send('Unauthorized');
  }

  if (req.userId?.toString() !== userId.toString()) {
    return res.status(403).send('Forbidden');
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
