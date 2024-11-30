import { Request, Response } from 'express';
import { initComponents } from '../../utility/initComponents';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';

export const createHandler = async (req: Request, res: Response) => {
  const isLoggedIn = req.userId !== null;
  if (!isLoggedIn) {
    return res
      .status(401)
      .json({ msg: 'You need to be logged in to create a project.' });
  }

  const nameTaken =
    (await await ProjectModel.findOne({
      name: req.body.project.name,
      ownerId: req.userId,
    })) !== null;
  if (nameTaken) {
    return res.status(409).json({ msg: 'Project name already taken.' });
  }

  const project = new ProjectModel({
    name: req.body.project.name,
    description: req.body.project.description,
    ownerId: req.userId!.toString(),
    contributors: [],
    visibility: req.body.project.visibility,
    dateCreatedOn: new Date(),
    dateLastEdited: new Date(),
    components: initComponents(),
    models: [],
  });

  const insertResult = await project.save();
  await UserModel.updateOne(
    { _id: req.userId! },
    {
      $push: { projectIds: insertResult._id },
    }
  );
  return res.status(200).json({
    msg: 'Project created successfully.',
    project: { _id: insertResult._id },
  });
};
