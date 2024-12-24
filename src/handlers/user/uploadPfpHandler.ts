import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import sharp from 'sharp';
import path from 'path';

export const uploadPfpHandler = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { buffer } = req.file;
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width > Number(process.env.MAX_PFP_SIZE) ||
    metadata.height > Number(process.env.MAX_PFP_SIZE)
  ) {
    return res.status(400).json({
      msg: 'Invalid image dimensions. Resolution should be below 512x512',
    });
  }

  const filename = `${req.userId}.png`;
  const pfpPath = path.join(process.env.PFP_DIRECTORY as string, filename);

  await image
    .resize(
      Number(process.env.PFP_SAVE_SIZE),
      Number(process.env.PFP_SAVE_SIZE)
    )
    .png()
    .toFile(pfpPath);

  const user = await UserModel.findById(req.userId);
  user!.pfpPath = pfpPath;
  await user!.save();

  return res.status(200).json({ msg: 'Profile picture uploaded' });
};
