import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { UserModel } from '../mongooseSchemas/userSchema';

interface JwtPayload {
  _id: string;
}

export const authMiddleware = async (
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
    const userId = new mongoose.Types.ObjectId(decoded._id);
    if (!userId) {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    const user = await UserModel.findOne({ _id: userId });

    if (user === null) {
      return res.status(404).json({ msg: 'User matching token not found' });
    }

    const userTokens = user.tokens;

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const updatedTokens = userTokens.filter((token: any) => {
      return new Date(token.createdAt) > oneMonthAgo;
    });

    user.tokens = updatedTokens as any;

    await user.save();

    if (!userTokens.find((token: any) => token.token === token)) {
      return res.status(401).json({ msg: 'Invalid token' });
    }

    req.userId = userId;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      req.userId = undefined;
      next();
    } else {
      req.logger.error(err);
      res.status(500).json({ msg: 'Internal server error.' });
      throw err;
    }
  }
};
