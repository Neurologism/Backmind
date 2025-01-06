import { Request, Response } from 'express';
import { TaskModel } from 'mongooseSchemas/task.schema';

export const trainingStatusHandler = async (
  body: any,
  req: Request,
  res: Response
) => {
  const model = await TaskModel.findOne({ _id: body.model._id });
  if (model === null) {
    return res
      .status(404)
      .send({ message: 'Model with that id does not exist.' });
  }
  if (model.ownerId.toString() !== req.userId?.toString()) {
    return res.status(403).send({ message: 'Not authorized.' });
  }

  return res.status(200).send({
    model: {
      status: model.status,
      output: model.output,
      dateQueued: model.dateQueued,
      dateStarted: model.dateStarted,
      dateFinished: model.dateFinished,
      projectId: model.projectId,
      ownerId: model.ownerId,
    },
  });
};
