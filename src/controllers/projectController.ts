import { Request, Response } from 'express';
import {
  RequestExplicit,
  Project,
  UserExplicit,
  ProjectExplicit,
} from '../types';
import bcrypt from 'bcrypt';

export const getProject = async (req: Request, res: Response) => {
  req as RequestExplicit;
  if (!req.body['project']['_id']) {
    return res.status(400).send('Please specify a project id.');
  }
  const project = (await req.dbprojects!.findOne({
    _id: req.body['project']['_id'],
  })) as ProjectExplicit;
  if (project === null) {
    return res.status(404).send('No project found matching the criteria.');
  }
  if (project.visibility === 'private') {
    if (req.user_id === null) {
      return res.status(404).send('No project found matching the criteria.');
    }
    if (
      project.owner_id !== req.user_id ||
      !project.contributors.includes(req.user_id)
    ) {
      return res.status(404).send('No project found matching the criteria.');
    }
  }
  return res.status(200).json({ project });
};

export const updateProject = async (req: Request, res: Response) => {
  req as RequestExplicit;
  if (!req.body['project']['_id']) {
    return res.status(400).send('Please specify a project id.');
  }
  const dbProject = (await req.dbprojects!.findOne({
    _id: req.body['project']['_id'],
  })) as ProjectExplicit;
  if (dbProject === null) {
    return res.status(404).send('No project found matching the criteria.');
  }
  let modify_project = { $set: {} };
  if (dbProject.visibility === 'private') {
    if (req.user_id === null) {
      return res.status(404).send('No project found matching the criteria.');
    } else if (dbProject.owner_id === req.user_id) {
      modify_project = {
        $set: {
          name: req.body['project']['name'],
          description: req.body['project']['description'],
          visibility: req.body['project']['visibility'],
          owner_id: req.body['project']['owner_id'],
          contributors: req.body['project']['contributors'],
          blocks: req.body['project']['blocks'],
          variables: req.body['project']['variables'],
          last_edited: Date.now(),
        },
      };
      if (req.body['project']['owner_id']) {
        if (req.body['project']['plain_password'] === undefined) {
          return res
            .status(400)
            .send('Please specify a password to change the project owner.');
        }
        if (
          (await req.dbusers!.findOne({
            _id: req.body['project']['owner_id'],
          })) === null
        ) {
          return res
            .status(404)
            .send(
              'Please specify a valid owner id. The given user does not exist.'
            );
        }
        const user = (await req.dbusers!.findOne({
          _id: req.user_id,
        })) as unknown as UserExplicit;
        if (
          bcrypt.compareSync(
            req.body['project']['plain_password'],
            user.password_hash
          )
        ) {
          return res.status(400).send('The password is incorrect.');
        }
      }
    }
  } else if (dbProject.contributors.includes(req.user_id!)) {
    modify_project = {
      $set: {
        description: req.body['project']['description'],
        blocks: req.body['project']['blocks'],
        variables: req.body['project']['variables'],
        last_edited: Date.now(),
      },
    };
  } else {
    return res.status(404).send('No project found matching the criteria.');
  }
  await req.dbprojects!.updateOne(
    { _id: req.body['project']['_id'] },
    modify_project
  );
  return res.status(200).send('Project changed successfully.');
};

export const createProject = async (req: Request, res: Response) => {
  req as RequestExplicit;
  if (req.user_id === null) {
    return res.status(401).send('Please log in first.');
  }
  if (
    req.body['project']['visibility'] !== 'public' &&
    req.body['project']['visibility'] !== 'private'
  ) {
    return res.status(400).send('Please specify a valid visibility.');
  }
  if (
    req.body['project']['name'] === undefined ||
    req.body['project']['description'] === undefined
  ) {
    return res.status(400).send('Please specify a name and a description.');
  }
  const project: Project = {
    name: req.body['project']['name'],
    description: req.body['project']['description'],
    owner_id: req.user_id,
    contributors: [],
    visibility: req.body['project']['visibility'],
    created_on: Date.now(),
    last_edited: Date.now(),
    blocks: [],
    variables: [],
  };
  await req.dbprojects!.insertOne(project);
  return res.status(200).send('Project created successfully.');
};

export const deleteProject = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const searchProject = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const modelStartTraining = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const modelStopTraining = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const modelStatusTraining = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const modelQuery = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const modelDownload = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};
