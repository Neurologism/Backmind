import { Email, UserModel } from '../../../mongooseSchemas/user.schema';
import jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

export const verifyEmailHandler = async (token: string) => {
  const user = await UserModel.findOne({
    emails: {
      $elemMatch: { verificationToken: token },
    },
  });

  if (user === null) {
    throw new HttpException(
      'Invalid verification token',
      HttpStatus.BAD_REQUEST
    );
  }

  const email = user.emails.find(
    (email) => email.verificationToken === token
  ) as Email;

  if (email.verified) {
    throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
  }

  if (email.dateVerificationSent === undefined) {
    throw new HttpException(
      'Invalid verification token',
      HttpStatus.BAD_REQUEST
    );
  }

  if (
    (new Date().getTime() - email.dateVerificationSent.getTime()) / 60000 >=
    Number(process.env.EMAIL_VERIFICATION_TOKEN_VALID_MINUTES)
  ) {
    throw new HttpException(
      'Invalid verification token',
      HttpStatus.BAD_REQUEST
    );
  }

  email.verified = true;
  email.dateVerified = new Date();

  await user.save();

  const authorizationToken = jwt.sign(
    { _id: '' + user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN }
  );

  return {
    authorizationToken,
    redirectUrl: new URL(
      '/profile/login',
      process.env.WHITEMIND_HOSTNAME
    ).toString(),
  };
};
