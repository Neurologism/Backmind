import { Request, Response } from 'express';
import { RequestExplicit } from '../types';
import { stripComponents } from '../utility/stripComponents';

export const modelStartTraining = async (req: Request, res: Response) => {
  req as RequestExplicit;

  const task = stripComponents(req.project.components);
  const model = {
    status: 'queued',
    output: [],
    task: task,
    last_updated_at: Date.now(),
    queued_at: Date.now(),
    started_at: null,
    finished_at: null,
    error: null,
  };

  const insertResult = await req.dbModels!.insertOne(model);
  const modelId = insertResult.insertedId;
  await req.dbTrainingQueue!.insertOne({ modelId });
  await req.dbProjects!.updateOne({ _id: req.project._id }, {
    $push: { models: modelId },
  } as any);

  res.status(200).send({ modelId, msg: 'Model training queued.' });
};

export const modelStopTraining = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const modelStatusTraining = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const modelQuery = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const modelDownload = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};
