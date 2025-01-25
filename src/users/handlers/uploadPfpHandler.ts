import { UserDocument } from '../../../mongooseSchemas/user.schema';
import sharp from 'sharp';
import path from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const uploadPfpHandler = async (
  user: UserDocument,
  files: Record<string, Storage.MultipartFile[]>
) => {
  if (!files) {
    throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
  }

  const buffer = files[Object.keys(files)[0]][0].buffer;
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

  const filename = `${user._id}.png`;
  const pfpPath = path.join(process.env.PFP_DIRECTORY as string, filename);

  await image
    .resize(
      Number(process.env.PFP_SAVE_SIZE),
      Number(process.env.PFP_SAVE_SIZE)
    )
    .png()
    .toFile(pfpPath);

  user.pfpPath = pfpPath;
  await user.save();

  return { msg: 'Profile picture uploaded' };
};
