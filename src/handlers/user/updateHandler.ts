import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const updateHandler = async (req: Request, res: Response) => {
  if (req.userId === undefined) {
    return res.status(401).json({ msg: 'You are not authenticated.' });
  }

  const user = await UserModel.findOne({
    _id: req.userId,
  });

  if (user === null) {
    return res
      .status(404)
      .json({ msg: 'Authentication token invalid. Try relogging.' });
  }

  if (req.body.user.oldPassword !== undefined) {
    const passwordsMatch = bcrypt.compareSync(
      req.body.user.oldPassword,
      user.passwordHash!
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The old password is incorrect.' });
    }
    delete req.body.user.oldPassword;
    if (req.body.user.newPassword !== undefined) {
      req.body.passwordHash = bcrypt.hashSync(
        req.body.user.newPassword,
        Number(process.env.SALT_ROUNDS)
      );
      delete req.body.user.newPassword;
    }
  }

  user.set(req.body.user);
  user.dateLastEdited = new Date();
  user.markModified('dateLastEdited');
  await user.save();

  return res.status(200).json({ msg: 'User updated successfully.' });
};
