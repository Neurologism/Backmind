import { Request, Response } from 'express';

export const modelStatusTraining = async (req: Request, res: Response) => {
  return res.status(200).send({
    model: {
      status: req.body.model.status,
      output: req.body.model.output,
      queued_at: req.body.model.queued_at,
      started_at: req.body.model.started_at,
      finished_at: req.body.model.finished_at,
      project_id: req.body.model.project_id,
    },
  });
};
