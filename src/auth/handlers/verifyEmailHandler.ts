import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import jwt from 'jsonwebtoken';

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const { token } = req.query;

  const user = await UserModel.findOne({
    emails: {
      $elemMatch: { verificationToken: token },
    },
  });

  if (user === null) {
    return res.status(400).json({ msg: 'Invalid verification token' });
  }

  const email = user.emails.find((email) => email.verificationToken === token);
  if (
    (new Date().getTime() - email!.dateVerificationSent!.getTime()) / 60000 >=
    Number(process.env.EMAIL_VERIFICATION_TOKEN_VALID_MINUTES)
  ) {
    return res.status(400).json({ msg: 'Invalid verification token' });
  }

  email!.verified = true;
  email!.dateVerified = new Date();

  user.save();

  const authorizationtoken = jwt.sign(
    { _id: '' + user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN }
  );

  res.set('Authorization', authorizationtoken);
  return res.redirect(
    new URL('/profile/login', process.env.WHITEMIND_HOSTNAME).toString()
  );
};
