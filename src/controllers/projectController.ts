import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { initComponents } from '../utility/initComponents';
import { updateProjectAsContributorSchema } from '../zodSchemas/projectSchemas';
import { z } from 'zod';
import { UserModel } from '../mongooseSchemas/userSchema';
import { ProjectModel } from '../mongooseSchemas/projectSchema';
import { TaskModel } from '../mongooseSchemas/taskSchema';

export const getProject = async (req: Request, res: Response) => {
  return res.status(200).json({ project: req.project! });
};

export const updateProject = async (req: Request, res: Response) => {
  if (
    req.body.project.name !== undefined &&
    req.body.project.name !== req.project!.name
  ) {
    const nameTaken =
      (await ProjectModel.findOne({
        name: req.body.project.name,
        owner_id: req.user_id,
      })) !== null;
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

  const current_user = await UserModel.findById(req.user_id);

  if (req.body.project.plain_password) {
    const passwordsMatch = bcrypt.compareSync(
      req.body.project.plain_password,
      current_user?.password_hash!
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The password is incorrect.' });
    }
  }

  delete req.body.project.plain_password;
  await ProjectModel.updateOne(
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

  const nameTaken =
    (await await ProjectModel.findOne({
      name: req.body.project.name,
      owner_id: req.user_id,
    })) !== null;
  if (nameTaken) {
    return res.status(409).json({ msg: 'Project name already taken.' });
  }

  const project = new ProjectModel({
    name: req.body.project.name,
    description: req.body.project.description,
    owner_id: req.user_id!.toString(),
    contributors: [],
    visibility: req.body.project.visibility,
    created_on: Date.now(),
    last_edited: Date.now(),
    components: initComponents(),
    models: [],
  });

  const insertResult = await project.save();
  await UserModel.updateOne(
    { _id: req.user_id! },
    {
      $push: { project_ids: insertResult._id },
    }
  );
  return res.status(200).json({
    msg: 'Project created successfully.',
    project: { _id: insertResult._id },
  });
};

export const deleteProject = async (req: Request, res: Response) => {
  if (!req.middlewareParams.isProjectOwner) {
    return res
      .status(401)
      .json({ msg: 'You are not the owner of this project.' });
  }

  const activeModels =
    (await TaskModel.findOne({
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

  await ProjectModel.deleteOne({ _id: req.project!._id });
  await TaskModel.deleteMany({ project_id: req.project!._id });
  await UserModel.updateOne(
    { _id: req.user_id! },
    {
      $pull: { project_ids: req.project!._id },
    }
  );
  return res.status(200).json({ msg: 'Project deleted successfully.' });
};

export const searchProject = async (req: Request, res: Response) => {
  return res.status(500).json({ msg: 'still in developement' });
};

export const isTakenProject = async (req: Request, res: Response) => {
  const isLoggedIn = req.user_id !== null;
  if (!isLoggedIn) {
    return res.status(401).json({ msg: 'You need to be logged in.' });
  }

  const nameTaken =
    (await ProjectModel.findOne({
      name: req.body.project.name,
      owner_id: req.user_id,
    })) !== null;

  if (nameTaken) {
    return res
      .status(409)
      .json({ msg: 'This project name is already in use.' });
  }
  return res.status(200).json({ msg: 'This project name is available.' });
};
