import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import fs from 'fs';

export const getPfp = async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.body.user._id);
  const pfpPath = user!.pfp_path;

  if (!pfpPath || !fs.existsSync(pfpPath)) {
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
