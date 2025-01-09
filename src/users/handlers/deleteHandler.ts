import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';

export const deleteHandler = async (userId: Types.ObjectId) => {
  const user = await UserModel.findById(userId);

  if (user === null) {
    throw new NotFoundException('User not found');
  }

  const runningTask = await TaskModel.findOne({
    ownerId: userId,
    status: { $in: ['queued', 'training'] },
  });
  if (runningTask !== null) {
    throw new ConflictException('Cannot delete user with running tasks');
  }

  let promises = [];

  promises.push(
    ProjectModel.deleteMany({
      ownerId: userId,
    })
  );

  promises.push(
    TaskModel.deleteMany({
      ownerId: userId,
    })
  );

  promises.push(
    Promise.all(
      user.followerIds.map((followerId) =>
        UserModel.updateOne(
          { _id: followerId },
          { $pull: { followingIds: userId } }
        )
      )
    )
  );

  promises.push(
    Promise.all(
      user.followerIds.map((followerId) =>
        UserModel.updateOne(
          { _id: followerId },
          { $pull: { followingIds: userId } }
        )
      )
    )
  );

  promises.push(
    UserModel.deleteOne({
      _id: userId,
    })
  );

  await Promise.all(promises);

  return { msg: 'User deleted' };
};
