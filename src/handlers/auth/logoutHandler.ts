import { Request, Response } from 'express';

export const logoutHandler = async (req: Request, res: Response) => {
  req.logger.error('Not implemented yet.');
};
