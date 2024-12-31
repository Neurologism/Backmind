import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../mongooseSchemas/userSchema';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { URL } from 'url';

export const registerHandler = async (req: Request, res: Response) => {
  const givenUser = req.body['user'];

  if (!req.body.agreedToTermsOfServiceAndPrivacyPolicy) {
    return res
      .status(400)
      .json({
        msg: 'You need to agree to the terms of service and privacy policy.',
      });
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(givenUser.plainPassword, salt);

  const mailVerificationToken = crypto.randomBytes(32).toString('hex');
  const verificationLink = new URL(
    `/api/auth/verify-email?token=${mailVerificationToken}`,
    process.env.BACKMIND_HOSTNAME as string
  ).toString();

  const sendVerification = !Boolean(process.env.VERIFY_ALL_EMAILS);
  if (sendVerification) {
    try {
      sgMail.send({
        to: givenUser.email,
        from: 'no-reply@whitemind.net',
        subject: 'Verify your Email',
        text: `Verify your email address \nYou need to verify your email address to create your account. Click the link below to verify your email address. The link will expire in one hour. \n\n${verificationLink} \n\nIn case you didn't create an account on whitemind.net, you can safely ignore this email.`,
      });
    } catch (e) {
      req.logger.error(e);
      return res.status(500).json({ msg: 'Error sending verification email.' });
    }
  }

  const newUser = new UserModel({
    emails: [
      {
        emailType: 'primary',
        verified: !sendVerification,
        address: givenUser.email,
        verificationToken: mailVerificationToken,
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

  savedUser.tokens.push({ token: token });

  await savedUser.save();
  res.status(201).json({ msg: 'User registered successfully', token: token });
};
