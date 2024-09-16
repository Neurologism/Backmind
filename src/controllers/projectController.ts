import { Request, Response } from 'express';
import {
  RequestExplicit,
  Project,
  UserExplicit,
  ProjectExplicit,
} from '../types';
import bcrypt from 'bcrypt';
import { initComponents } from '../utility/initComponents';
import { updateProjectAsContributorSchema } from '../schemas/projectSchemas';
import { z } from 'zod';

export const getProject = async (req: Request, res: Response) => {
  req as RequestExplicit;

  return res.status(200).json({ project: req.project! });
};

export const updateProject = async (req: Request, res: Response) => {
  req as RequestExplicit;

  if (!req.middlewareParams.isProjectOwner) {
    try {
      req.body = await updateProjectAsContributorSchema.parseAsync(req.body);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: JSON.parse(error.message),
          error_friendly: error.flatten(),
        });
      } else {
        throw error;
      }
    }
  }

  const current_user = (await req.dbUsers!.findOne({
    _id: req.user_id!,
  })) as unknown as UserExplicit;

  if (req.body.project.plain_password) {
    const passwordsMatch = bcrypt.compareSync(
      req.body.project.plain_password,
      current_user.password_hash
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The password is incorrect.' });
    }
  }

  delete req.body.project.plain_password;
  await req.dbProjects!.updateOne(
    { _id: req.body.project._id },
    {
      $set: req.body.project,
    }
  );
  return res.status(200).json({ msg: 'Project changed successfully.' });
};

export const createProject = async (req: Request, res: Response) => {
  req as RequestExplicit;

  const isLoggedIn = req.user_id !== null;
  if (!isLoggedIn) {
    return res
      .status(401)
      .json({ msg: 'You need to be logged in to create a project.' });
  }

  const project = {
    name: req.body.project.name,
    description: req.body.project.description,
    owner_id: req.user_id!.toString(),
    contributors: [],
    visibility: req.body.project.visibility,
    created_on: Date.now(),
    last_edited: Date.now(),
    camera_position: [0, 0, 0],
    components: initComponents(),
  };

  const insertResult = await req.dbProjects!.insertOne(project);
  await req.dbUsers!.updateOne({ _id: req.user_id! }, {
    $push: { project_ids: insertResult.insertedId },
  } as any);
  return res.status(200).json({
    msg: 'Project created successfully.',
    project: { _id: insertResult.insertedId },
  });
};

export const deleteProject = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const searchProject = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};
