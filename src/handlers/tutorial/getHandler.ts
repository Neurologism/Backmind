import { Request, Response } from 'express';
import { TutorialModel } from '../../mongooseSchemas/tutorialSchema';
import { UserModel } from '../../mongooseSchemas/userSchema';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';

export const getHandler = async (req: Request, res: Response) => {
  const loggedIn = req.body.userId !== undefined;
  if (!loggedIn) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const tutorial = await TutorialModel.findOne({
    _id: req.body.tutorialId,
    visibility: 'public',
  });

  const tutorialExists = tutorial !== null;
  if (!tutorialExists) {
    return res.status(404).json({ msg: 'Tutorial not found' });
  }

  const user = await UserModel.findById(req.body.userId);

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
      startProject: tutorial.startProject,
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
        trainedModel: step.trainedModel,
      })),
    },
    tutorialCompleted: false,
    tutorialStarted: false,
  } as any;

  const tutorialCompleted = user!.completedTutorials.some(
    (tutorialId) => tutorialId.toString() === tutorial._id.toString()
  );
  responseJson.tutorialCompleted = tutorialCompleted;

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
