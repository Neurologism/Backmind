import { Request, Response } from 'express';
import { RequestExplicit } from '../types';
import { stripComponents } from '../utility/stripComponents';

export const modelStartTraining = async (req: Request, res: Response) => {
  req as RequestExplicit;
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
