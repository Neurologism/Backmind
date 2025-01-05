import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const isTakenHandler = async (
  body: any,
  req: Request,
  res: Response
) => {
  const searchProperties = {
    $or: [],
  } as any;

  if (body.user.email !== undefined) {
    searchProperties.$or.push({ 'emails.address': body.user.email });
  }
  if (body.user.brainetTag !== undefined) {
    searchProperties.$or.push({ brainetTag: body.user.brainetTag });
  }

  const user = await UserModel.findOne(searchProperties);
  if (user !== null) {
    return res
      .status(409)
      .json({ msg: 'This email or brainet tag is already in use.' });
  }
  return res.status(200).json({ msg: 'This user is not taken.' });
};
