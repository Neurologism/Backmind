import { Request, Response } from 'express';
import {
  RequestExplicit,
  Project,
  UserExplicit,
  ProjectExplicit,
} from '../types';
import bcrypt from 'bcrypt';
import { updateProjectAsContributorSchema } from '../schemas/projectSchemas';
import { z } from 'zod';

export const getProject = async (req: Request, res: Response) => {
  req as RequestExplicit;

  const project = (await req.dbprojects!.findOne({
    _id: req.body.project._id,
  })) as ProjectExplicit;

  if (project === null) {
    return res.status(404).json({
      msg: "This project doesn't exist.",
    });
  }

  if (project.visibility === 'private') {
    if (req.user_id === null) {
      return res.status(404).json({
        msg: 'This project is private. You need to be logged in to access it. ',
      });
    }
    const isOwner = project.owner_id.toString() === req.user_id!.toString();
    const isContributor = project.contributors
      .map((contributor) => contributor.toString())
      .includes(req.user_id!.toString());

    if (!isOwner && !isContributor) {
      return res.status(404).json({
        msg: 'This project is private.',
      });
    }
  }

  return res.status(200).json({ project });
};

export const updateProject = async (req: Request, res: Response) => {
  req as RequestExplicit;

  if (req.user_id === null) {
    return res
      .status(400)
      .json({ msg: 'You need to provide an auth token to update a project.' });
  }

  const dbProject = (await req.dbprojects!.findOne({
    _id: req.body.project._id,
  })) as ProjectExplicit;

  const projectExists = dbProject !== null;
  if (!projectExists) {
    return res.status(404).json({
      msg: "There is no project with that id or you don't have access to it.",
    });
  }

  const isProjectOwner =
    dbProject.owner_id.toString() === req.user_id!.toString();
  const canUpdateProject =
    isProjectOwner || dbProject.contributors.includes(req.user_id!);
  if (!canUpdateProject) {
    return res.status(404).json({
      msg: "There is no project with that id or you don't have access to it.",
    });
  }

  if (!isProjectOwner) {
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

  const current_user = (await req.dbusers!.findOne({
    _id: req.user_id,
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
  await req.dbprojects!.updateOne(
    { _id: req.body.project._id },
    {
      $set: {
        ...req.body.project,
        last_edited: Date.now(),
      },
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
  };

  const insertResult = await req.dbprojects!.insertOne(project);
  await req.dbusers!.updateOne({ _id: req.user_id! }, {
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
