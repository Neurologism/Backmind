import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const schemaValidationMiddleware = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: JSON.parse(error.message),
          error_friendly: error.flatten(),
        });
      } else {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
    }
  };
};
