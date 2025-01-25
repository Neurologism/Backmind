import { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';
import { HttpException, HttpStatus, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

export const getPfpHandler = async (
  userid: Types.ObjectId
): Promise<StreamableFile> => {
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

  const file = createReadStream(pfpPath);
  return new StreamableFile(file);
};
