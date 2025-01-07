import { Request, Response } from 'express';
import { TutorialModel } from '../../../mongooseSchemas/tutorial.schema';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { Types } from 'mongoose';
import { SetStateDto } from '../dto/setState.schema';

export const setStateHandler = async (
  tutorialId: Types.ObjectId,
  body: SetStateDto,
  req: Request,
  res: Response
) => {
  if (req.userId === undefined) {
    return res.status(403).json({
      msg: 'You need to be authenticated to access this resource.',
    });
  }

  const user = await UserModel.findById(req.userId);

  if (user === null) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const tutorial = await TutorialModel.findOne({
    _id: tutorialId,
    visibility: 'public',
  });

  const tutorialExists = tutorial !== null;
  if (!tutorialExists) {
    return res.status(404).json({ msg: 'Tutorial not found' });
  }

  if (tutorial.requiredPremiumTier > user.premiumTier) {
    return res.status(403).json({ msg: 'Premium required' });
  }

  let project = await ProjectModel.findOne({
    ownerId: user._id,
    isTutorialProject: true,
    tutorialId: tutorial._id,
  });

  const startProject = await ProjectModel.findById(tutorial.startProject);

  if (project === null) {
    project = new ProjectModel({
      name: tutorial.name,
      description: tutorial.description,
      ownerId: user._id,
      visibility: 'private',
      isTutorialProject: true,
      tutorialId: tutorial._id,
      components: startProject?.components,
    });
  }

  project.tutorialStep = body.setStep;
  if (
    body.setCompleted &&
    !user.completedTutorials.some(
      (tutorialId) => tutorialId.toString() === tutorial._id.toString()
    )
  ) {
    user.completedTutorials.push(tutorial._id);
  }

  await project.save();
  await user.save();

  return res
    .status(200)
    .json({ msg: 'Tutorial state updated', projectId: project._id });
};
