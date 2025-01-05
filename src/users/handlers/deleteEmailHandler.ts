import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const deleteEmailHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const secondaryEmail = user.emails.find(
    (email) => email.emailType === req.body.user.emailType
  );

  if (!secondaryEmail) {
    return res
      .status(400)
      .json({ msg: 'User does not have the specified email type' });
  }

  user.emails = user.emails.filter(
    (email) => email.emailType !== req.body.user.emailType
  );
  await user.save();

  return res.status(200).json({ msg: 'Email deleted successfully' });
};
