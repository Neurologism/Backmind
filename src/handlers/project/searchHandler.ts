import { Request, Response } from 'express';
import { ProjectModel } from '../../mongooseSchemas/projectSchema';

export const searchProject = async (req: Request, res: Response) => {
  return res.status(500).json({ msg: 'still in developement' });
};
