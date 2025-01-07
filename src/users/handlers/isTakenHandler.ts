import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const isTakenHandler = async (
  brainetTag: string,
  email: string,
  res: Response
) => {
  const searchProperties = {
    $or: [],
  } as any;

  if (email !== undefined) {
    searchProperties.$or.push({ 'emails.address': email });
  }
  if (brainetTag !== undefined) {
    searchProperties.$or.push({ brainetTag: brainetTag });
  }

  const user = await UserModel.findOne(searchProperties);
  if (user !== null) {
    return res
      .status(409)
      .json({ msg: 'This email or brainet tag is already in use.' });
  }
  return res.status(200).json({ msg: 'This user is not taken.' });
};
