import { UserDocument } from '../../../mongooseSchemas/user.schema';
import { sendVerificationEmail } from '../../../utility/sendVerificationEmail';
import { UpdateEmailDto } from '../dto/updateEmail.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppLogger } from '../../../providers/logger.provider';

export const updateEmailHandler = async (
  user: UserDocument,
  body: UpdateEmailDto,
  logger: AppLogger
) => {
  if (
    body.user.emailType === 'primary' &&
    user.emails.find((email) => email.emailType === 'primary' && email.verified)
  ) {
    throw new HttpException(
      'A verified primary email cannot be updated',
      HttpStatus.BAD_REQUEST
    );
  }

  let verifyEmailReturn = await sendVerificationEmail(body.user.email, logger);

  if (user.emails.find((email) => email.emailType === body.user.emailType)) {
    user.emails = user.emails.filter(
      (email) => email.emailType !== body.user.emailType
    );
  }

  user.emails.push({
    emailType: body.user.emailType,
    verified: Boolean(process.env.VERIFY_ALL_EMAILS),
    address: body.user.email,
    verificationToken: verifyEmailReturn.mailVerificationToken,
    dateVerificationSent: new Date(),
    dateAdded: new Date(),
  });

  await user.save();

  return {
    msg: 'Email updated successfully',
    verifyEmailSend: verifyEmailReturn.verifyEmailSend,
  };
};
