import { ObjectId } from 'mongodb';

export type User = {
  _id?: ObjectId;
  email?: string;
  about_you?: string;
  displayname?: string;
  brainet_tag?: string;
  password_hash?: string;
  date_of_birth?: number;
  visibility?: 'public' | 'private';
  created_on?: number;
  project_ids?: ObjectId[];
  follower_ids?: ObjectId[];
  following_ids?: ObjectId[];
};

export type UserExplicit = Required<User>;

export type UserLogin = {
  email?: string;
  brainet_tag?: string;
  plain_password: string;
};

export type UserRegister = {
  email: string;
  plain_password: string;
  brainet_tag: string;
};

export type UserUpdate = {
  email?: string;
  about_you?: string;
  displayname?: string;
  brainet_tag?: string;
  date_of_birth?: number;
  visibility?: 'public' | 'private';
  new_password?: string;
  old_password?: string;
  password_hash?: string;
};
