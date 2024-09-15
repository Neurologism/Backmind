import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

interface JwtPayload {
  _id: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token!,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const user_id = new ObjectId(decoded._id);
    req.user_id = user_id;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      req.user_id = null;
      next();
    } else {
      req.logger.error(err);
      res.status(500).json({ msg: 'Internal server error.' });
      throw err;
    }
  }
};
