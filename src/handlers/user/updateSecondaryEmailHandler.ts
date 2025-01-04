import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';
import crypto from 'crypto';
import { URL } from 'url';
import sgMail from '@sendgrid/mail';

export const updateSecondaryEmailHandler = async (
  req: Request,
  res: Response
) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const mailVerificationToken = crypto.randomBytes(32).toString('hex');
  const verificationLink = new URL(
    `/api/auth/verify-email?token=${mailVerificationToken}`,
    process.env.BACKMIND_HOSTNAME as string
  ).toString();

  try {
    await sgMail.send({
      to: req.body.email,
      from: 'no-reply@whitemind.net',
      subject: 'Verify your Email',
      text: `Verify your email address \nYou need to verify your email address to create your account. Click the link below to verify your email address. The link will expire in one hour. \n\n${verificationLink} \n\nIn case you didn't create an account on whitemind.net, you can safely ignore this email.`,
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(401).json({ msg: 'Error sending verification email.' });
  }

  if (user.emails.find((email) => email.emailType === 'secondary')) {
    user.emails.pull({ emailType: 'secondary' });
  }

  user.emails.push({
    emailType: 'secondary',
    verified: false,
    address: req.body.email,
    verificationToken: mailVerificationToken,
    dateVerificationSent: new Date(),
  });

  await user.save();

  return res.status(200).json({ msg: 'Secondary email updated successfully' });
};
