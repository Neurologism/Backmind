import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';

export const getPfpHandler = async (userId: Types.ObjectId, res: Response) => {
  const user = await UserModel.findById(userId);

  if (user === null) {
    return res.status(404).json({ msg: 'User not found.' });
  }

  const pfpPath = path.join(
    process.env.PFP_DIRECTORY as string,
    user._id.toString() + '.png'
  );
  console.log(pfpPath);
  if (!fs.existsSync(pfpPath)) {
    return res
      .status(404)
      .json({ msg: "There's no profile picture for this user." });
  }

  return res.sendFile(pfpPath, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ msg: 'There was an error sending the file.' });
    }
  });
};
