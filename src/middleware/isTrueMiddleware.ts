import { Request, Response, NextFunction } from 'express';

export const isEnabledMiddleware = (condition: boolean) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (condition) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  };
};
