import fs from 'fs';
import path from 'path';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getPfpHandler = async (userid: Types.ObjectId) => {
  const pfpPath = path.join(
    process.env.PFP_DIRECTORY as string,
    userid.toString() + '.png'
  );
  console.log(pfpPath);
  if (!fs.existsSync(pfpPath)) {
    throw new HttpException(
      'There is no profile picture for this user.',
      HttpStatus.NOT_FOUND
    );
  }

  try {
    return fs.readFileSync(pfpPath);
  } catch {
    throw new HttpException(
      'There was an error sending the file.',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
