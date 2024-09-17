import { Request, Response, NextFunction } from 'express';
import { connectToDatabase } from '../utility/connectToDatabase';
import { RequestExplicit } from '../types';

export const dbMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.db = await connectToDatabase();
    req.dbUsers = req.db.collection('users');
    req.dbProjects = req.db.collection('projects');
    req.dbTrainingQueue = req.db.collection('training_queue');
    req.dbModels = req.db.collection('models');
    next();
  } catch (error) {
    req.logger.error('Failed to inject database', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
