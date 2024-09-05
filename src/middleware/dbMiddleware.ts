import { Request, Response, NextFunction } from 'express';
import { connectToDatabase } from '../database';
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
    console.error('Failed to inject database', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
