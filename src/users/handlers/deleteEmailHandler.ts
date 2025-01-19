import { UserDocument } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const deleteEmailHandler = async (
  user: UserDocument,
  emailType: string
) => {
  const secondaryEmail = user.emails.find(
    (email: { emailType: string }) => email.emailType === emailType
  );

  if (!secondaryEmail) {
    throw new HttpException(
      'User does not have the specified email type',
      HttpStatus.BAD_REQUEST
    );
  }

  user.emails = user.emails.filter(
    (email: { emailType: string }) => email.emailType !== emailType
  );
  await user.save();

  return { msg: 'Email deleted successfully' };
};
