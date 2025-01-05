import crypto from 'crypto';
import { URL } from 'url';
import sgMail from '@sendgrid/mail';

export const sendVerificationEmail = async (email: string, logger: any) => {
  const mailVerificationToken = crypto.randomBytes(32).toString('hex');
  const verificationLink = new URL(
    `/api/auth/verify-email?token=${mailVerificationToken}`,
    process.env.BACKMIND_HOSTNAME as string
  ).toString();

  const sendVerification = !Boolean(process.env.VERIFY_ALL_EMAILS);
  let verifyEmailSend = sendVerification;
  if (sendVerification) {
    try {
      await sgMail.send({
        to: email,
        from: 'no-reply@whitemind.net',
        subject: 'Verify your Email',
        text: `Verify your email address \nYou need to verify your email address to create your account. Click the link below to verify your email address. The link will expire in one hour. \n\n${verificationLink} \n\nIn case you didn't create an account on whitemind.net, you can safely ignore this email.`,
      });
    } catch (e) {
      logger.error(e);
      verifyEmailSend = false;
    }
  }

  return { mailVerificationToken, verificationLink, verifyEmailSend };
};
