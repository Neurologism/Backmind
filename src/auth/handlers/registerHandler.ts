import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { sendVerificationEmail } from '../../../utility/sendVerificationEmail';
import { AppLogger } from '../../logger.service';
import { RegisterDto } from '../dto/register.schema';

export const registerHandler = async (
  body: RegisterDto,
  req: Request,
  res: Response,
  logger: AppLogger
) => {
  const user = await UserModel.findOne({
    $or: [
      { 'emails.address': body.user.email },
      { brainetTag: body.user.brainetTag },
    ],
  });
  if (user !== null) {
    return res.status(400).json({
      msg: 'User already exists',
    });
  }

  if (Boolean(process.env.DISABLE_ACCOUNT_CREATION as string)) {
    return res.status(403).json({
      msg: 'Account creation is disabled.',
    });
  }

  const givenUser = body['user'];

  if (!body.agreedToTermsOfServiceAndPrivacyPolicy) {
    return res.status(400).json({
      msg: 'You need to agree to the terms of service and privacy policy.',
    });
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
  res.status(201).json({
    msg: 'User registered successfully',
    token: token,
    verifyEmailSend: verifyEmailReturn.verifyEmailSend,
  });
};
