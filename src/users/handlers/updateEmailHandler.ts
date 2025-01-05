import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { sendVerificationEmail } from '../../../utility/sendVerificationEmail';

export const updateEmailHandler = async (
  body: any,
  req: Request,
  res: Response
) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  if (
    body.user.emailType === 'primary' &&
    user.emails.find((email) => email.emailType === 'primary' && email.verified)
  ) {
    return res
      .status(400)
      .json({ msg: 'A verified primary email cannot be updated' });
  }

  let verifyEmailReturn = await sendVerificationEmail(body.user.email, user);

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

  return res.status(200).json({
    msg: 'Email updated successfully',
    verifyEmailSend: verifyEmailReturn.verifyEmailSend,
  });
};
