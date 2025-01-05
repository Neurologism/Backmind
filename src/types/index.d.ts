import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { Logger } from 'winston';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    export interface Request {
      userId?: mongoose.Types.ObjectId | null;
      project?: ProjectExplicit;
      middlewareParams?: any;
      logger: Logger;
    }
  }
}
