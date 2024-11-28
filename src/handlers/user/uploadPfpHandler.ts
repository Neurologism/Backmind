import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import sharp from 'sharp';
import path from 'path';

export const uploadPfp = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { buffer } = req.file;
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width > 512 ||
    metadata.height > 512
  ) {
    return res.status(400).json({
      msg: 'Invalid image dimensions. Resolution should be below 512x512',
    });
  }

  const filename = `${req.user_id}.webp`;
  const pfpPath = path.join(process.env.PFP_DIRECTORY as string, filename);

  await image.resize(128, 128).webp().toFile(pfpPath);

  const user = await UserModel.findById(req.user_id);
  user!.pfp_path = pfpPath;
  await user!.save();

  return res.status(200).json({ msg: 'Profile picture uploaded' });
};
