import { TutorialModel } from '../../../mongooseSchemas/tutorial.schema';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export const getByNameHandler = async (
  tutorialName: string,
  userId: Types.ObjectId
) => {
  if (userId === undefined) {
    throw new HttpException(
      'You need to be authenticated to access this resource.',
      HttpStatus.FORBIDDEN
    );
  }
  let tutorial;
  if (tutorialName !== undefined) {
    tutorial = await TutorialModel.findOne({
      name: tutorialName,
      visibility: 'public',
    });
  } else {
    throw new HttpException(
      'You need to provide a tutorialName.',
      HttpStatus.BAD_REQUEST
    );
  }

  if (tutorial === null) {
    throw new HttpException('Tutorial not found', HttpStatus.NOT_FOUND);
  }

  const user = await UserModel.findById(userId);

  if (user === null) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  if (tutorial.requiredPremiumTier > user.premiumTier) {
    throw new HttpException('Premium required', HttpStatus.FORBIDDEN);
  }

  const responseJson = {
    tutorial: {
      _id: tutorial._id,
      name: tutorial.name,
      summary: tutorial.summary,
      description: tutorial.description,
      requiredTutorials: tutorial.requiredTutorials,
      nextTutorials: tutorial.nextTutorials,
      experienceGain: tutorial.experienceGain,
      unlockNodes: tutorial.unlockNodes,
      steps: tutorial.steps.map((step) => ({
        text: step.text,
        narrator: step.narrator,
        addNodes: step.addNodes,
        addEdges: step.addEdges,
        removeNodes: step.removeNodes,
        removeEdges: step.removeEdges,
        highlightNodeTypes: step.highlightNodeTypes,
        unlockNodes: step.unlockNodes,
        trainingEnabled: step.trainingEnabled,
      })),
    },
    tutorialCompleted: false,
    tutorialStarted: false,
    currentStep: 0,
    projectId: null,
    isUnlocked: true,
  } as any;

  for (const requiredTutorialId of tutorial.requiredTutorials) {
    if (
      !user.completedTutorials.some(
        (completedTutorialId) =>
          completedTutorialId.toString() === requiredTutorialId.toString()
      )
    ) {
      responseJson.isUnlocked = false;
      break;
    }
  }

  responseJson.tutorialCompleted = user.completedTutorials.some(
    (tutorialId) => tutorialId.toString() === tutorial._id.toString()
  );

  const project = await ProjectModel.findOne({
    ownerId: user._id,
    isTutorialProject: true,
    tutorialId: tutorial._id,
  });

  const tutorialStarted = project !== null;
  if (tutorialStarted) {
    responseJson.tutorialStarted = true;
    responseJson.currentStep = project.tutorialStep;
    responseJson.projectId = project._id;
  }

  return responseJson;
};
