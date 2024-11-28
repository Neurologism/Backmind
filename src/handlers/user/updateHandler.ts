import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const updateHandler = async (req: Request, res: Response) => {
  if (req.user_id === undefined) {
    return res.status(401).json({ msg: 'You are not authenticated.' });
  }

  const db_user = await UserModel.findOne({
    _id: req.user_id,
  });

  if (db_user === null) {
    return res
      .status(404)
      .json({ msg: 'Authentication token invalid. Try relogging.' });
  }

  if (req.body.user.old_password !== undefined) {
    const passwordsMatch = bcrypt.compareSync(
      req.body.user.old_password,
      db_user.password_hash!
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The old password is incorrect.' });
    }
    delete req.body.user.old_password;
  }

  if (req.body.user.new_password !== undefined) {
    req.body.password_hash = bcrypt.hashSync(
      req.body.user.new_password,
      Number(process.env.SALT_ROUNDS)
    );
    delete req.body.user.new_password;
  }

  await UserModel.updateOne({ _id: req.user_id! }, { $set: req.body.user });
  return res.status(200).json({ msg: 'User updated successfully.' });
};
