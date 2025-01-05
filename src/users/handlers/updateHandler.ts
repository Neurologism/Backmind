import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const updateHandler = async (body: any, req: Request, res: Response) => {
  if (req.userId === undefined) {
    return res.status(401).json({ msg: 'You are not authenticated.' });
  }

  const user = await UserModel.findById(req.userId);

  if (user === null) {
    return res
      .status(404)
      .json({ msg: 'Authentication token invalid. Try relogging.' });
  }

  if (body.user.oldPassword !== undefined) {
    const passwordsMatch = bcrypt.compareSync(
      body.user.oldPassword,
      user.passwordHash
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The old password is incorrect.' });
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

  return res.status(200).json({ msg: 'User updated successfully.' });
};
