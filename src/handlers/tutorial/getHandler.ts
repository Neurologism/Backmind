import { Request, response, Response } from 'express';
import { TutorialModel } from '../../mongooseSchemas/tutorialSchema';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const getHandler = async (req: Request, res: Response) => {
  const tutorial = await TutorialModel.findOne({
    _id: req.body.tutorialId,
    visibility: 'public',
  });

  const tutorialExists = tutorial !== null;
  if (!tutorialExists) {
    return res.status(404).send('Tutorial not found');
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
      startProject: tutorial.startProject,
      unlockNodes: tutorial.unlockNodes,
      steps: tutorial.steps.map((step) => ({
        text: step.text,
        narrator: step.narrator,
        addNodes: step.addNodes,
        addEdges: step.addEdges,
        highlightNodeTypes: step.highlightNodeTypes,
        unlockNodes: step.unlockNodes,
      })),
    },
    tutorialCompleted: false,
    tutorialStarted: false,
  } as any;

  const loggedIn = req.body.userId !== undefined;
  if (!loggedIn) {
    return res.status(200).send(responseJson);
  }

  const user = await UserModel.findById(req.body.userId);

  const tutorialCompleted = user!.completedTutorials.some(
    (tutorialId) => tutorialId.toString() === tutorial._id.toString()
  );
  responseJson.tutorialCompleted = tutorialCompleted;

  for (const startedTutorial of user!.startedTutorials) {
    if (startedTutorial.tutorialId.toString() === tutorial._id.toString()) {
      responseJson.tutorialStarted = false;
      responseJson.currentStep = startedTutorial.step;
      responseJson.projectId = startedTutorial.projectId;
      break;
    }
  }

  return res.status(200).send(responseJson);
};
