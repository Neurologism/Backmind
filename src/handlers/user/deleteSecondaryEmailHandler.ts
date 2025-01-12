import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const deleteSecondaryEmailHandler = async (
  req: Request,
  res: Response
) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const secondaryEmail = user.emails.find(
    (email) => email.emailType === 'secondary'
  );

  if (!secondaryEmail) {
    return res
      .status(400)
      .json({ msg: 'User does not have a secondary email' });
  }

  user.emails.pull({ emailType: 'secondary' });
  await user.save();

  return res.status(200).json({ msg: 'Secondary email deleted successfully' });
};
