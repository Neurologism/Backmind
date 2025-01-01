import { Request, Response } from 'express';
import { TutorialModel } from '../../mongooseSchemas/tutorialSchema';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';

export const getHandler = async (req: Request, res: Response) => {
  if (req.userId === undefined) {
    return res.status(403).json({
      msg: 'You need to be authenticated to access this resource.',
    });
  }
  let tutorial;
  if (req.body.tutorialId !== undefined) {
    tutorial = await TutorialModel.findOne({
      _id: req.body.tutorialId,
      visibility: 'public',
    });
  } else if (req.body.tutorialName !== undefined) {
    tutorial = await TutorialModel.findOne({
      name: req.body.tutorialName,
      visibility: 'public',
    });
  } else {
    return res.status(400).json({
      msg: 'You need to provide either a tutorialId or tutorialName.',
    });
  }

  if (tutorial === null) {
    return res.status(404).json({ msg: 'Tutorial not found' });
  }

  const user = await UserModel.findById(req.userId);

  if (tutorial.premiumRequired && !user!.premium) {
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
