import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import sharp from 'sharp';
import path from 'path';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const uploadPfpHandler = async (
  userId: Types.ObjectId,
  req: Request,
  file: Express.Multer.File
) => {
  if (!file) {
    throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
  }

  const { buffer } = file;
  const image = sharp(buffer);
  const metadata = await image.metadata();

  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width > Number(process.env.MAX_PFP_SIZE) ||
    metadata.height > Number(process.env.MAX_PFP_SIZE)
  ) {
    throw new HttpException(
      'Invalid image dimensions. Resolution should be below 512x512',
      HttpStatus.BAD_REQUEST
    );
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

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  user.pfpPath = pfpPath;
  await user.save();

  return { msg: 'Profile picture uploaded' };
};
