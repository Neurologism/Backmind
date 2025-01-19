import { TutorialModel } from '../../../mongooseSchemas/tutorial.schema';
import { UserDocument } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getHandler = async (
  tutorialId: Types.ObjectId,
  user: UserDocument
) => {
  let tutorial;
  if (tutorialId !== undefined) {
    tutorial = await TutorialModel.findOne({
      _id: tutorialId,
      visibility: 'public',
    });
  } else {
    throw new HttpException(
      'You need to provide a tutorialId.',
      HttpStatus.BAD_REQUEST
    );
  }

  if (tutorial === null) {
    throw new HttpException('Tutorial not found', HttpStatus.NOT_FOUND);
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
    projectId: null as Types.ObjectId | null,
    isUnlocked: true,
  };

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
    responseJson.currentStep = project.tutorialStep as number;
    responseJson.projectId = project._id;
  }

  return responseJson;
};
