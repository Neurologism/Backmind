import { TutorialModel } from '../../../mongooseSchemas/tutorial.schema';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { Types } from 'mongoose';
import { SetStateDto } from '../dto/setState.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const setStateHandler = async (
  tutorialId: Types.ObjectId,
  body: SetStateDto,
  userId: Types.ObjectId
) => {
  if (userId === undefined) {
    throw new HttpException(
      'You need to be authenticated to access this resource.',
      HttpStatus.FORBIDDEN
    );
  }

  const user = await UserModel.findById(userId);

  if (user === null) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  const tutorial = await TutorialModel.findOne({
    _id: tutorialId,
    visibility: 'public',
  });

  if (tutorial === null) {
    throw new HttpException('Tutorial not found', HttpStatus.NOT_FOUND);
  }

  if (tutorial.requiredPremiumTier > user.premiumTier) {
    throw new HttpException('Premium required', HttpStatus.FORBIDDEN);
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

  return { msg: 'Tutorial state updated', projectId: project._id };
};
