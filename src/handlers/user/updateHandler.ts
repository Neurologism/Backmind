import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../../mongooseSchemas/userSchema';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { URL } from 'url';

export const updateHandler = async (req: Request, res: Response) => {
  if (req.userId === undefined) {
    return res.status(401).json({ msg: 'You are not authenticated.' });
  }

  const user = await UserModel.findById(req.userId);

  if (user === null) {
    return res
      .status(404)
      .json({ msg: 'Authentication token invalid. Try relogging.' });
  }

  if (req.body.user.oldPassword !== undefined) {
    const passwordsMatch = bcrypt.compareSync(
      req.body.user.oldPassword,
      user.passwordHash
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The old password is incorrect.' });
    }
    delete req.body.user.oldPassword;
    if (req.body.user.newPassword !== undefined) {
      user.passwordHash = bcrypt.hashSync(
        req.body.user.newPassword,
        Number(process.env.SALT_ROUNDS)
      );
      delete req.body.user.newPassword;
    }
  }

  if (
    !user.emails.some(
      (email) => email.emailType === 'primary' && email.verified
    )
  ) {
    if (req.body.user.primaryEmail !== undefined) {
      user.emails.pull({ emailType: 'primary' });

      const mailVerificationToken = crypto.randomBytes(32).toString('hex');
      const verificationLink = new URL(
        `/api/auth/verify-email?token=${mailVerificationToken}`,
        process.env.BACKMIND_HOSTNAME as string
      ).toString();

      const sendVerification = !Boolean(process.env.VERIFY_ALL_EMAILS);
      if (sendVerification) {
        try {
          await sgMail.send({
            to: req.body.user.primaryEmail,
            from: 'no-reply@whitemind.net',
            subject: 'Verify your Email',
            text: `Verify your email address \nYou need to verify your email address to create your account. Click the link below to verify your email address. The link will expire in one hour. \n\n${verificationLink} \n\nIn case you didn't create an account on whitemind.net, you can safely ignore this email.`,
          });
        } catch (e) {
          req.logger.error(e);
          return res
            .status(401)
            .json({ msg: 'Error sending verification email.' });
        }
      }

      user.emails.push({
        emailType: 'primary',
        verified: !sendVerification,
        address: req.body.user.primaryEmail,
        verificationToken: mailVerificationToken,
        dateVerificationSent: new Date(),
      });
    }
  }

  if (req.body.user.pronouns !== undefined) {
    user.pronouns = req.body.user.pronouns;
  }

  if (req.body.user.company !== undefined) {
    user.company = req.body.user.company;
  }

  if (req.body.user.location !== undefined) {
    user.location = req.body.user.location;
  }

  user.set(req.body.user);
  user.dateLastEdited = new Date();
  user.markModified('dateLastEdited');
  await user.save();

  return res.status(200).json({ msg: 'User updated successfully.' });
};
