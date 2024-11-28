import { Request, Response } from 'express';
import { isEmptyObject } from '../../utility/isEmptyObject';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const getHandler = async (req: Request, res: Response) => {
  let search_params;

  if (isEmptyObject(req.body)) {
    if (req.user_id === undefined) {
      return res
        .status(401)
        .json({ msg: 'You are not authenticated but provided an empty body.' });
    }
    search_params = {
      _id: req.user_id,
    };
  } else {
    search_params = req.body.user;
  }

  const user = await UserModel.findOne(search_params);
  if (user === null) {
    return res
      .status(404)
      .json({ msg: 'No user found matching the criteria.' });
  }

  const isUser = user._id.toString() === req.user_id?.toString();
  const isFollowedByUser = (() => {
    for (const following_id of user.following_ids) {
      if (following_id._id.toString() === req.user_id?.toString()) {
        return true;
      }
      return false;
    }
  })();

  if (user.visibility === 'private' && !isUser && !isFollowedByUser) {
    return res.status(403).json({
      msg: 'This user is private. You can only access private users if they follow you.',
    });
  }

  const userJson = user.toJSON();
  if (!isUser) {
    delete userJson.email;
    delete userJson.date_of_birth;
  }

  return res.status(200).json({ user: userJson });
};
