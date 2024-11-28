import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRouter';
import userRoutes from './routes/user';
import projectRoutes from './routes/projectRouter';
import { setupSwagger } from './swagger';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { logger, loggingMiddleware } from './middleware/loggingMiddleware';
import rateLimit from 'express-rate-limit';
import {} from './types';

const accessLogStream = fs.createWriteStream(path.join('./logs/access.log'), {
  flags: 'a',
});

const app: Express = express();
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(
  rateLimit({
    windowMs: 60 * 1000 * Number(process.env.RATE_LIMIT_DURATION), // 5 min
    max: Number(process.env.RATE_LIMIT_REQUESTS),
    message: "You're sending too many requests.",
  })
);
app.use(
  morgan(
    '[:date[web]] :method :url HTTP/:http-version :status :response-time ms - :res[content-length] :user-agent',
    { stream: accessLogStream }
  )
);
app.use(
  morgan(
    '[:date[web]] :method :url HTTP/:http-version :status :response-time ms - :res[content-length] :user-agent'
  )
);
app.use(loggingMiddleware);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  return res.status(500).json({
    status: 'error',
    msg:
      process.env.SEND_ERR_TO_CLIENT === 'true'
        ? 'Internal Server Error'
        : err.message,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);

if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

app.get('/', async (req: Request, res: Response) => {
  req.logger.debug('GET / worked fine :)');
  return res.status(200).json({ msg: 'Backmind Express Server' });
});

export default app;
