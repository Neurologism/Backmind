import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const schemaValidationMiddleware = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: JSON.parse(error.message),
          error_friendly: error.flatten(),
        });
      } else {
        if (process.env.SEND_ERR_TO_CLIENT) {
          return res.status(500).json({ error: error.stack });
        } else {
          return res.status(500).json({ error: 'Internal server error' });
        }
      }
    }
  };
};
