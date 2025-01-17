import { UserDocument, UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import { ConflictException } from '@nestjs/common';

export const deleteHandler = async (user: UserDocument) => {
  const runningTask = await TaskModel.findOne({
    ownerId: user._id,
    status: { $in: ['queued', 'training'] },
  });
  if (runningTask !== null) {
    throw new ConflictException('Cannot delete user with running tasks');
  }

  const promises = [];

  promises.push(
    ProjectModel.deleteMany({
      ownerId: user._id,
    })
  );

  promises.push(
    TaskModel.deleteMany({
      ownerId: user._id,
    })
  );

  promises.push(
    Promise.all(
      user.followerIds.map((followerId) =>
        UserModel.updateOne(
          { _id: followerId },
          { $pull: { followingIds: user._id } }
        )
      )
    )
  );

  promises.push(
    Promise.all(
      user.followerIds.map((followerId) =>
        UserModel.updateOne(
          { _id: followerId },
          { $pull: { followingIds: user._id } }
        )
      )
    )
  );

  promises.push(
    UserModel.deleteOne({
      _id: user._id,
    })
  );

  await Promise.all(promises);

  return { msg: 'User deleted' };
};
