import { Request, Response } from 'express';

export const trainingStatusHandler = async (req: Request, res: Response) => {
  return res.status(200).send({
    model: {
      status: req.body.model.status,
      output: req.body.model.output,
      dateQueuedAt: req.body.model.dateQueuedAt,
      dateStartedAt: req.body.model.dateStartedAt,
      dateFinishedAt: req.body.model.dateFinishedAt,
      projectId: req.body.model.projectId,
    },
  });
};
