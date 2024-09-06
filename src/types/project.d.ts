import { ObjectId } from 'mongodb';

export type ProjectVariable = {}

export type ProjectBlock = {}

export type Project = {
  _id?: ObjectId;
  name?: string;
  description?: string;
  owner_id?: ObjectId;
  contributors?: ObjectId[];
  visibility?: 'public' | 'private';
  created_on?: number;
  last_edited?: number;
  blocks?: ProjectBlock[];
  variables?: ProjectVariable[];
};

export type ProjectExplicit = Required<Project>;
