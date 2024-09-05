import { ObjectId } from 'mongodb';

export type Project = {
  _id?: ObjectId;
  name?: string;
  description?: string;
  owner_id?: number;
  contributors?: number[];
  visibility?: 'public' | 'private';
  created_on?: number;
  last_edited?: number;
  blocks?: Block[];
  variables?: Variable[];
};

export type ProjectExplicit = Required<Project>;
