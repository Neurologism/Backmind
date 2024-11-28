import { Request, Response } from 'express';

export const getHandler = async (req: Request, res: Response) => {
  return res.status(200).json({ project: req.project! });
};
