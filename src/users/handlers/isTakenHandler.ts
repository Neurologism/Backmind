import { HttpException, HttpStatus } from '@nestjs/common';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const isTakenHandler = async (brainetTag: string, email: string) => {
  const searchProperties = {
    $or: [],
  } as any;

  if (email !== undefined) {
    searchProperties.$or.push({ 'emails.address': email });
  }
  if (brainetTag !== undefined) {
    searchProperties.$or.push({ brainetTag: brainetTag });
  }

  const user = await UserModel.findOne(searchProperties);
  if (user !== null) {
    return { msg: 'This user is taken.' };
  }
  return { msg: 'This user is not taken.' };
};
