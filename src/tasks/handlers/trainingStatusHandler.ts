import { Request, Response } from 'express';

export const trainingStatusHandler = async (
  body: any,
  req: Request,
  res: Response
) => {
  return res.status(200).send({
    model: {
      status: body.model.status,
      output: body.model.output,
      dateQueued: body.model.dateQueued,
      dateStarted: body.model.dateStarted,
      dateFinished: body.model.dateFinished,
      projectId: body.model.projectId,
      ownerId: body.model.ownerId,
    },
  });
};
