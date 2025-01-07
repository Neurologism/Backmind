import { Request, Response } from 'express';
import { Email, UserModel } from '../../../mongooseSchemas/user.schema';
import jwt from 'jsonwebtoken';

export const verifyEmailHandler = async (token: string, res: Response) => {
  const user = await UserModel.findOne({
    emails: {
      $elemMatch: { verificationToken: token },
    },
  });

  if (user === null) {
    return res.status(400).json({ msg: 'Invalid verification token' });
  }

  const email = user.emails.find(
    (email) => email.verificationToken === token
  ) as Email;

  if (email.verified) {
    return res.status(400).json({ msg: 'Email already verified' });
  }

  if (email.dateVerificationSent === undefined) {
    return res.status(400).json({ msg: 'Invalid verification token' });
  }

  if (
    (new Date().getTime() - email.dateVerificationSent.getTime()) / 60000 >=
    Number(process.env.EMAIL_VERIFICATION_TOKEN_VALID_MINUTES)
  ) {
    return res.status(400).json({ msg: 'Invalid verification token' });
  }

  email.verified = true;
  email.dateVerified = new Date();

  user.save();

  const authorizationToken = jwt.sign(
    { _id: '' + user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN }
  );

  res.set('Authorization', authorizationToken);
  return res.redirect(
    new URL('/profile/login', process.env.WHITEMIND_HOSTNAME).toString()
  );
};
