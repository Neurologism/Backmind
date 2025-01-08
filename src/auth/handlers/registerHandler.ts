import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { sendVerificationEmail } from '../../../utility/sendVerificationEmail';
import { AppLogger } from '../../logger.service';
import { RegisterDto } from '../dto/register.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const registerHandler = async (
  body: RegisterDto,
  req: Request,
  logger: AppLogger
) => {
  const user = await UserModel.findOne({
    $or: [
      { 'emails.address': body.user.email },
      { brainetTag: body.user.brainetTag },
    ],
  });
  if (user !== null) {
    throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
  }

  if (Boolean(process.env.DISABLE_ACCOUNT_CREATION as string)) {
    throw new HttpException(
      'Account creation is disabled.',
      HttpStatus.FORBIDDEN
    );
  }

  const givenUser = body['user'];

  if (!body.agreedToTermsOfServiceAndPrivacyPolicy) {
    throw new HttpException(
      'You need to agree to the terms of service and privacy policy.',
      HttpStatus.BAD_REQUEST
    );
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(givenUser.plainPassword, salt);

  let verifyEmailReturn = await sendVerificationEmail(givenUser.email, logger);

  const newUser = new UserModel({
    emails: [
      {
        emailType: 'primary',
        verified: Boolean(process.env.VERIFY_ALL_EMAILS),
        address: givenUser.email,
        verificationToken: verifyEmailReturn.mailVerificationToken,
        dateVerificationSent: new Date(),
      },
    ],
    brainetTag: givenUser.brainetTag,
    displayname: givenUser.brainetTag,
    passwordHash: hashedPassword,
  });
  const savedUser = await newUser.save();

  const token = jwt.sign(
    { _id: '' + savedUser._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN }
  );

  savedUser.tokens.push({ token: token } as any);

  await savedUser.save();
  return {
    msg: 'User registered successfully',
    token: token,
    verifyEmailSend: verifyEmailReturn.verifyEmailSend,
  };
};
