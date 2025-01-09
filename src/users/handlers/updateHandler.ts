import bcrypt from 'bcrypt';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { UpdateDto } from '../dto/update.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const updateHandler = async (
  userId: Types.ObjectId,
  body: UpdateDto
) => {
  const user = await UserModel.findById(userId);

  if (user === null) {
    throw new HttpException(
      'Authentication token invalid. Try relogging.',
      HttpStatus.NOT_FOUND
    );
  }

  if (body.user.oldPassword !== undefined) {
    const passwordsMatch = bcrypt.compareSync(
      body.user.oldPassword,
      user.passwordHash
    );
    if (!passwordsMatch) {
      throw new HttpException(
        'The old password is incorrect.',
        HttpStatus.BAD_REQUEST
      );
    }
    delete body.user.oldPassword;
    if (body.user.newPassword !== undefined) {
      user.passwordHash = bcrypt.hashSync(
        body.user.newPassword,
        Number(process.env.SALT_ROUNDS)
      );
      delete body.user.newPassword;
    }
  }

  user.set(body.user);
  user.dateLastEdited = new Date();
  user.markModified('dateLastEdited');
  await user.save();

  return { msg: 'User updated successfully.' };
};
