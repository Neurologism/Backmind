import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const isTakenUser = async (req: Request, res: Response) => {
  const search_properties: { $or: { email?: any; brainet_tag?: any }[] } = {
    $or: [],
  };

  if (req.body.user.email !== undefined) {
    search_properties.$or.push({ email: req.body.user.email });
  }
  if (req.body.user.brainet_tag !== undefined) {
    search_properties.$or.push({ brainet_tag: req.body.user.brainet_tag });
  }

  const user = await UserModel.findOne(search_properties);
  if (user !== null) {
    return res
      .status(409)
      .json({ msg: 'This email or brainet tag is already in use.' });
  }
  return res.status(200).json({ msg: 'This user is not taken.' });
};
