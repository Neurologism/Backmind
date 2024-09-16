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
    req.dbusers = req.db.collection('users');
    req.dbprojects = req.db.collection('projects');
    next();
  } catch (error) {
    req.logger.error('Failed to inject database', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
