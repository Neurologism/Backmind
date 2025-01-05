import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const isTakenHandler = async (req: Request, res: Response) => {
  const searchProperties = {
    $or: [],
  } as any;

  if (req.body.user.email !== undefined) {
    searchProperties.$or.push({ 'emails.address': req.body.user.email });
  }
  if (req.body.user.brainetTag !== undefined) {
    searchProperties.$or.push({ brainetTag: req.body.user.brainetTag });
  }

  const user = await UserModel.findOne(searchProperties);
  if (user !== null) {
    return res
      .status(409)
      .json({ msg: 'This email or brainet tag is already in use.' });
  }
  return res.status(200).json({ msg: 'This user is not taken.' });
};
