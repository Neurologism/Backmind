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
import { projectNameExists } from '../utility/projectNameExists';

export const getProject = async (req: Request, res: Response) => {
  return res.status(200).json({ project: req.project! });
};

export const updateProject = async (req: Request, res: Response) => {
  if (
    req.body.project.name !== undefined &&
    req.body.project.name !== req.project!.name
  ) {
    const nameTaken = await projectNameExists(
      req.body.project.name,
      req.user_id!
    );
    if (nameTaken) {
      return res.status(409).json({ msg: 'Project name already taken.' });
    }
  }

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
  const isLoggedIn = req.user_id !== null;
  if (!isLoggedIn) {
    return res
      .status(401)
      .json({ msg: 'You need to be logged in to create a project.' });
  }

  const nameTaken = await projectNameExists(
    req.body.project.name,
    req.user_id!
  );
  if (nameTaken) {
    return res.status(409).json({ msg: 'Project name already taken.' });
  }

  const project = {
    name: req.body.project.name,
    description: req.body.project.description,
    owner_id: req.user_id!.toString(),
    contributors: [],
    visibility: req.body.project.visibility,
    created_on: Date.now(),
    last_edited: Date.now(),
    camera_position: [0, 0, 1],
    components: initComponents(),
    models: [],
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
  if (!req.middlewareParams.isProjectOwner) {
    return res
      .status(401)
      .json({ msg: 'You are not the owner of this project.' });
  }

  const activeModels =
    (await req.dbModels!.findOne({
      $and: [
        { project_id: req.project!._id },
        { $or: [{ status: 'queued' }, { status: 'training' }] },
      ],
    })) !== null;
  if (activeModels) {
    return res.status(400).json({
      msg: 'You cannot delete a project with training in queue or in progress.',
    });
  }

  await req.dbProjects!.deleteOne({ _id: req.project!._id });
  await req.dbModels!.deleteMany({ project_id: req.project!._id });
  await req.dbUsers!.updateOne(
    { _id: req.user_id! },
    {
      $pull: { project_ids: req.project!._id },
    }
  );
  return res.status(200).json({ msg: 'Project deleted successfully.' });
};

export const searchProject = async (req: Request, res: Response) => {
  const projects = (await req
    .dbProjects!.find({
      $and: [
        { visibility: 'public' },
        {
          $or: [
            { name: { $regex: req.query.q as string } },
            { description: { $regex: req.query.q as string } },
          ],
        },
      ],
    })
    .limit(30)
    .toArray()) as Project[];

  for (const project of projects) {
    delete project.contributors;
    delete project.created_on;
    delete project.last_edited;
    delete project.camera_position;
    delete project.components;
    delete project.models;
  }

  return res.status(200).json({ projects: projects });
};

export const isTakenProject = async (req: Request, res: Response) => {
  const isLoggedIn = req.user_id !== null;
  if (!isLoggedIn) {
    return res.status(401).json({ msg: 'You need to be logged in.' });
  }

  const nameTaken = await projectNameExists(
    req.body.project.name,
    req.user_id!
  );

  if (nameTaken) {
    return res
      .status(409)
      .json({ msg: 'This project name is already in use.' });
  }
  return res.status(200).json({ msg: 'This project name is available.' });
};
