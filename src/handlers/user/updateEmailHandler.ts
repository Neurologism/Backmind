import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { sendVerificationEmail } from '../../utility/sendVerificationEmail';

export const updateEmailHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  if (
    req.body.user.emailType === 'primary' &&
    user.emails.find((email) => email.emailType === 'primary' && email.verified)
  ) {
    return res
      .status(400)
      .json({ msg: 'A verified primary email cannot be updated' });
  }

  let verifyEmailReturn = await sendVerificationEmail(
    req.body.user.email,
    user
  );

  if (
    user.emails.find((email) => email.emailType === req.body.user.emailType)
  ) {
    user.emails.pull({ emailType: req.body.user.emailType });
  }

  user.emails.push({
    emailType: req.body.user.emailType,
    verified: Boolean(process.env.VERIFY_ALL_EMAILS),
    address: req.body.user.email,
    verificationToken: verifyEmailReturn.mailVerificationToken,
    dateVerificationSent: new Date(),
  });

  await user.save();

  return res
    .status(200)
    .json({
      msg: 'Email updated successfully',
      verifyEmailSend: verifyEmailReturn.verifyEmailSend,
    });
};
