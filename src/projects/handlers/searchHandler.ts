import { Request, Response } from 'express';

export const searchHandler = async (body: any, req: Request, res: Response) => {
  return res.status(500).json({ msg: 'still in development' });
};
