import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import fs from 'fs';

export const getPfpHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({ brainetTag: req.params.brainetTag });

  if (user === null) {
    return res.status(404).json({ msg: 'User not found.' });
  }

  const pfpPath = user.pfpPath;

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
