import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../mongooseSchemas/userSchema';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { URL } from 'url';

export const registerHandler = async (req: Request, res: Response) => {
  const given_user = req.body['user'];

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(given_user.plain_password, salt);

  const mailVerificationToken = crypto.randomBytes(32).toString('hex');
  const verificationLink = new URL(
    `/verify-email?token=${mailVerificationToken}`,
    process.env.HOSTNAME as string
  ).toString();

  try {
    sgMail.send({
      to: given_user.email,
      from: 'no-reply@whitemind.net',
      subject: '# Verify your Email',
      text: `Verify your email address \nYou need to verify your email address to create your account. Click the following link to verify your email address: \n\n${verificationLink} \n\nIn case you didn't create an account on whitemind.net, you can safely ignore this email.`,
    });
  } catch (e) {
    req.logger.error(e);
    return res.status(500).json({ msg: 'Error sending verification email.' });
  }

  const newUser = new UserModel({
    emails: [
      {
        emailType: 'primary',
        verified: Boolean(process.env.VERIFY_ALL_EMAILS),
        address: given_user.email,
        verificationToken: mailVerificationToken,
        dateVerificationSent: new Date(),
      },
    ],
    brainet_tag: given_user.brainet_tag,
    displayname: given_user.brainet_tag,
    password_hash: hashedPassword,
  });

  const savedUser = await newUser.save();

  const token = jwt.sign(
    { _id: '' + savedUser._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN }
  );

  res.status(201).json({ msg: 'User registered successfully', token: token });
};
