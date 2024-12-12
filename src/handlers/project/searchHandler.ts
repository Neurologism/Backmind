import { Request, Response } from 'express';

export const searchHandler = async (req: Request, res: Response) => {
  return res.status(500).json({ msg: 'still in development' });
};
