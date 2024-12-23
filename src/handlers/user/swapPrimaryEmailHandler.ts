import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const swapPrimaryEmailHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }
  const primaryEmail = user.emails.find(
    (email) => email.emailType === 'primary'
  );
  const secondaryEmail = user.emails.find(
    (email) => email.emailType === 'secondary'
  );

  if (!primaryEmail || !secondaryEmail) {
    return res
      .status(400)
      .json({ msg: 'User does not have a primary or secondary email' });
  }

  if (!secondaryEmail.verified) {
    return res.status(400).json({ msg: 'Secondary email is not verified' });
  }

  primaryEmail.emailType = 'secondary';
  secondaryEmail.emailType = 'primary';
  await user.save();

  return res.status(200).json({ msg: 'Primary email swapped successfully' });
};
