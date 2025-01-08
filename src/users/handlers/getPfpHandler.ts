import { UserModel } from '../../../mongooseSchemas/user.schema';
import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getPfpHandler = async (userId: Types.ObjectId) => {
  const user = await UserModel.findById(userId);

  if (user === null) {
    throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
  }

  const pfpPath = path.join(
    process.env.PFP_DIRECTORY as string,
    user._id.toString() + '.png'
  );
  console.log(pfpPath);
  if (!fs.existsSync(pfpPath)) {
    throw new HttpException(
      "There's no profile picture for this user.",
      HttpStatus.NOT_FOUND
    );
  }

  try {
    return fs.readFileSync(pfpPath);
  } catch (err) {
    throw new HttpException(
      'There was an error sending the file.',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
