import { Request, Response } from 'express';
import { initComponents } from '../../utility/initComponents';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';

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
    created_on: new Date(),
    last_edited: new Date(),
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
