import { Request, Response } from 'express';
import { TutorialModel } from '../../../mongooseSchemas/tutorial.schema';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../../mongooseSchemas/project.schema';
import { ObjectId } from 'mongoose';

export const getHandler = async (
  tutorialId: ObjectId,
  req: Request,
  res: Response
) => {
  if (req.userId === undefined) {
    return res.status(403).json({
      msg: 'You need to be authenticated to access this resource.',
    });
  }
  let tutorial;
  if (tutorialId !== undefined) {
    tutorial = await TutorialModel.findOne({
      _id: tutorialId,
      visibility: 'public',
    });
  } else {
    return res.status(400).json({
      msg: 'You need to provide either a tutorialId.',
    });
  }

  if (tutorial === null) {
    return res.status(404).json({ msg: 'Tutorial not found' });
  }

  const user = await UserModel.findById(req.userId);

  if (user === null) {
    return res.status(404).json({ msg: 'User not found' });
  }

  if (tutorial.requiredPremiumTier > user.premiumTier) {
    return res.status(403).json({ msg: 'Premium required' });
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
      !user!.completedTutorials.some(
        (completedTutorialId) =>
          completedTutorialId.toString() === requiredTutorialId.toString()
      )
    ) {
      responseJson.isUnlocked = false;
      break;
    }
  }

  responseJson.tutorialCompleted = user!.completedTutorials.some(
    (tutorialId) => tutorialId.toString() === tutorial._id.toString()
  );

  const project = await ProjectModel.findOne({
    ownerId: user!._id,
    isTutorialProject: true,
    tutorialId: tutorial._id,
  });

  const tutorialStarted = project !== null;
  if (tutorialStarted) {
    responseJson.tutorialStarted = true;
    responseJson.currentStep = project.tutorialStep;
    responseJson.projectId = project._id;
  }

  return res.status(200).json(responseJson);
};
