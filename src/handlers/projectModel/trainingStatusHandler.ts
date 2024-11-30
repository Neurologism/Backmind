import { Request, Response } from 'express';

export const trainingStatusHandler = async (req: Request, res: Response) => {
  return res.status(200).send({
    model: {
      status: req.body.model.status,
      output: req.body.model.output,
      dateQueued: req.body.model.dateQueued,
      dateStarted: req.body.model.dateStarted,
      dateFinished: req.body.model.dateFinished,
      projectId: req.body.model.projectId,
    },
  });
};
