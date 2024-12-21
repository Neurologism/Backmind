import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { Logger } from 'winston';
import mongoose from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: mongoose.Types.ObjectId | null;
    project?: ProjectExplicit;
    middlewareParams?: any;
    logger: Logger;
  }
}
