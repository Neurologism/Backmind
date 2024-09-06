import { Request, Response } from 'express';
import { RequestExplicit, User, UserExplicit, UserUpdate } from '../types';
import bcrypt from 'bcrypt';

const isEmptyObject = (obj: Object) => JSON.stringify(obj) === '{}';

const sanitizeUser = (user: UserUpdate): UserUpdate => {
  const sanitizedUser = {
    email: user.email,
    about_you: user.about_you,
    displayname: user.displayname,
    brainet_tag: user.brainet_tag,
    date_of_birth: user.date_of_birth,
    visibility: user.visibility,
    new_password: user.new_password,
    old_password: user.old_password,
  };
  return sanitizedUser;
};

export const getUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  let user;
  if (isEmptyObject(req.body) || req.body['user']['_id'] === req.user_id) {
    if (req.user_id === undefined) {
      return res
        .status(401)
        .send("You provided an empty body but aren't authenticated. ");
    }
    user = req.dbusers!.findOne({ _id: req.user_id! }) as User;
    if (user === null) {
      return res.status(404).send('No user found matching the criteria.');
    }
    user.password_hash = undefined;
    return res.status(200).send(user);
  } else {
    const search_properties = {
      _id: req.body['user']['id'],
      brainet_tag: req.body['user']['brainet_tag'],
    };
    user = req.dbusers!.findOne(search_properties);
    if (user === null) {
      return res.status(404).send('No user found matching the criteria.');
    }
    user as User;
    const forbiddenProperties = ['password_hash', 'email', 'date_of_birth'];
    forbiddenProperties.forEach((item) => {
      user![item] = undefined;
    });
    return res.status(200).send(user);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  if (req.user_id === undefined) {
    return res.status(401).send('You are not authenticated.');
  }
  const db_user = req.dbusers!.findOne({
    _id: req.user_id!,
  }) as unknown as UserExplicit;
  if (db_user === null) {
    return res.status(404).send('This user does not exist.');
  }
  if (req.body['user'] === undefined) {
    return res.status(400).send('You need to provide a user object.');
  }
  const user = sanitizeUser(req.body['user'] as UserUpdate);
  if (isEmptyObject(user)) {
    return res.status(400).send('You provided an empty user.');
  }
  if (user.new_password !== undefined && user.old_password === undefined) {
    return res
      .status(400)
      .send('You need to provide the old password for a password change.');
  }
  if (user.old_password !== undefined) {
    if (bcrypt.compareSync(user.old_password, db_user.password_hash)) {
      return res.status(400).send('The old password is incorrect.');
    }
    if (user.new_password !== undefined) {
      user.password_hash = bcrypt.hashSync(
        user.new_password,
        Number(process.env.SALT_ROUNDS)
      );
      user.new_password = undefined;
    }
    user.old_password = undefined;
  }
  req.dbusers!.updateOne({ _id: req.user_id! }, { $set: user });
  return res.status(200).send('User updated successfully.');
};

export const isTakenUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  if (req.body['user'] === undefined) {
    return res.status(400).send('You need to provide a user object.');
  }
  if (
    req.body['user']['email'] === undefined &&
    req.body['user']['brainet_tag'] === undefined
  ) {
    return res
      .status(400)
      .send('You need to provide an email or a brainet_tag.');
  }
  const search_properties = {
    $or: [
      { email: req.body['user']['email'] },
      { brainet_tag: req.body['user']['brainet_tag'] },
    ],
  };
  const user = req.dbusers!.findOne(search_properties);
  if (user === null) {
    return res.status(200).send('This user is not taken.');
  }
  return res.status(409).send('This email or brainet tag is already in use.');
};

export const deleteUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  console.error('Not implemented yet.');
};

export const followUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  console.error('Not implemented yet.');
};

export const unfollowUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  console.error('Not implemented yet.');
};

export const searchUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  console.error('Not implemented yet.');
};
