import { Request, Response } from 'express';
import { TutorialModel } from '../../mongooseSchemas/tutorialSchema';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';

export const setStateHandler = async (req: Request, res: Response) => {
  if (req.userId === undefined) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const user = await UserModel.findById(req.userId);

  if (user === null) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const tutorial = await TutorialModel.findOne({
    _id: req.body.tutorialId,
    visibility: 'public',
  });

  const tutorialExists = tutorial !== null;
  if (!tutorialExists) {
    return res.status(404).json({ msg: 'Tutorial not found' });
  }

  if (tutorial.premiumRequired && !user.premium) {
    return res.status(403).json({ msg: 'Premium required' });
  }

  let project = await await ProjectModel.findOne({
    ownerId: user._id,
    isTutorialProject: true,
    tutorialId: tutorial._id,
  });

  if (project === null) {
    project = new ProjectModel({
      name: tutorial.name,
      description: tutorial.description,
      ownerId: user._id,
      visibility: 'private',
      isTutorialProject: true,
      tutorialId: tutorial._id,
      components: tutorial.startProject,
    });
  }

  project.tutorialStep = req.body.setStep;
  if (
    req.body.setCompleted ||
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
    .json({ msg: 'Tutorial state updated', tutorialId: tutorial._id });
};
