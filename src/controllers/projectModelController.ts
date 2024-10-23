import { Request, Response } from 'express';
import { stripComponents } from '../utility/stripComponents';

export const modelStartTraining = async (req: Request, res: Response) => {
  if (
    (await req.dbTrainingQueue!.countDocuments()) >
    Number(process.env.MAX_TRAINING_QUEUE_LENGTH)
  ) {
    return res
      .status(403)
      .send({ msg: 'Training queue is full. Try again later.' });
  }

  console.log(req.project.components);
  const task = stripComponents(req.project.components);
  console.log(task);
  const model = {
    status: 'queued',
    output: [],
    task: task,
    last_updated_at: Date.now(),
    queued_at: Date.now(),
    started_at: null,
    finished_at: null,
    error: null,
    project_id: req.project._id,
  };

  const insertResult = await req.dbModels!.insertOne(model);
  const modelId = insertResult.insertedId;
  await req.dbTrainingQueue!.insertOne({ model_id: modelId });
  await req.dbProjects!.updateOne({ _id: req.project._id }, {
    $push: { models: modelId },
  } as any);

  res
    .status(200)
    .send({ model: { _id: modelId }, msg: 'Model training queued.' });
};

export const modelStopTraining = async (req: Request, res: Response) => {
  const model = req.body.model;

  if (model.status === 'queued') {
    await req.dbTrainingQueue!.deleteOne({ model_id: model!._id });
  }

  await req.dbModels!.updateOne(
    { _id: model._id },
    {
      $set: {
        status: 'stopped',
        last_updated_at: Date.now(),
        finished_at: Date.now(),
      },
    }
  );

  res.status(200).send({ msg: 'Model training stopped.' });
};

export const modelStatusTraining = async (req: Request, res: Response) => {
  return res.status(200).send({
    model: {
      status: req.body.model.status,
      output: req.body.model.output,
      queued_at: req.body.model.queued_at,
      started_at: req.body.model.started_at,
      finished_at: req.body.model.finished_at,
      error: req.body.model.error,
      project_id: req.body.model.project_id,
    },
  });
};

export const modelQuery = async (req: Request, res: Response) => {
  req.logger.error('Not implemented yet.');
};

export const modelDownload = async (req: Request, res: Response) => {
  req.logger.error('Not implemented yet.');
};
