import { Logger } from 'winston';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    export interface Request {
      userId?: mongoose.Types.ObjectId | null;
      logger: Logger;
    }
  }
}
