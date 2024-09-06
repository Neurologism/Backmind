import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { Db, Collection, ObjectId } from 'mongodb';

declare module 'express-serve-static-core' {
  interface Request {
    user_id?: ObjectId | null;
    db?: Db;
    dbusers?: Collection;
    dbprojects?: Collection;
  }
}

export interface RequestExplicit extends Request {
  user_id: ObjectId | null;
  db: Db;
  dbusers: Collection;
  dbprojects: Collection;
}

export * from './user';
export * from './project';
