import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { sendVerificationEmail } from '../../../utility/sendVerificationEmail';
import { Types } from 'mongoose';
import { UpdateEmailDto } from '../dto/updateEmail.schema';

export const updateEmailHandler = async (
  userId: Types.ObjectId,
  body: UpdateEmailDto,
  req: Request,
  res: Response
) => {
  if (req.userId === undefined) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (req.userId?.toString() !== userId.toString()) {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  const user = await UserModel.findById({ _id: userId });

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
