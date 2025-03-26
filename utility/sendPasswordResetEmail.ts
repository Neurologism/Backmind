import { URL } from 'url';
import sgMail from '@sendgrid/mail';
import { AppLogger } from '../providers/logger.provider';

export const sendPasswordResetEmail = async (
  email: string,
  logger: AppLogger,
  token: string,
  userId: string
) => {
  const verificationLink = new URL(
    `/auth/reset-password?${new URLSearchParams({
      token: token,
      user_id: userId,
    })}`,
    process.env.WHITEMIND_HOSTNAME as string
  ).toString();

  try {
    await sgMail.send({
      to: email,
      from: 'no-reply@whitemind.net',
      subject: 'Reset password',
      text: `Password reset link incoming 🚀 \n\n${verificationLink} \n\nThis link will expire in one hour. If you did not request to reset your password, you can safely ignore this email.\n`,
    });
  } catch (e: any) {
    logger.error(e.message, e.stack);
  }
};
