import { Request, Response, NextFunction } from 'express';
import { RequestExplicit } from '../types';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user_id = Number(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
