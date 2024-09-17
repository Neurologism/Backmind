import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { Db, Collection, ObjectId } from 'mongodb';
import { Logger } from 'winston';

declare module 'express-serve-static-core' {
  interface Request {
    user_id?: ObjectId | null;
    db?: Db;
    dbUsers?: Collection;
    dbProjects?: Collection;
    dbTrainingQueue?: Collection;
    dbModels?: Collection;
    project?: ProjectExplicit;
    middlewareParams?: any;
    logger: Logger;
  }
}

export interface RequestExplicit extends Request {
  user_id: ObjectId | null;
  db: Db;
  dbUsers: Collection;
  dbProjects: Collection;
  dbTrainingQueue: Collection;
  dbModels: Collection;
}

export * from './user';
export * from './project';
