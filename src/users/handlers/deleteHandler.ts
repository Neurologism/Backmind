import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { TaskModel } from '../../../mongooseSchemas/task.schema';
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const deleteHandler = async (userId: Types.ObjectId, req: Request) => {
  if (req.userId === undefined) {
    throw new UnauthorizedException('Unauthorized');
  }

  if (req.userId?.toString() !== userId.toString()) {
    throw new ForbiddenException('Forbidden');
  }

  const user = await UserModel.findById(req.userId);

  if (user === null) {
    throw new NotFoundException('User not found');
  }

  const runningTask = await TaskModel.findOne({
    ownerId: req.userId,
    status: { $in: ['queued', 'training'] },
  });
  if (runningTask !== null) {
    throw new ConflictException('Cannot delete user with running tasks');
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

  return { msg: 'User deleted' };
};
