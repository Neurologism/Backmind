import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './database';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import projectRoutes from './routes/project';
import crypto from 'crypto';
import { setupSwagger } from './swagger';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { loggingMiddleware } from './middleware/loggingMiddleware';

dotenv.config();

try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

const accessLogStream = fs.createWriteStream(path.join('./logs/access.log'), {
  flags: 'a',
});

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
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
  req.logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    msg:
      process.env.NODE_ENV === 'developement'
        ? 'Internal Server Error'
        : err.message,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);

setupSwagger(app);

const express_port = process.env.EXPRESS_PORT || 3000;
process.env.JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
process.env.SALT_ROUNDS = process.env.SALT_ROUNDS || '10';

app.get('/', async (req: Request, res: Response) => {
  req.logger.debug('GET / worked fine :)');
  return res.status(200).json({ msg: 'Backmind Express Server' });
});

connectToDatabase().then(() =>
  app.listen(express_port, () => {
    console.log(
      `Express server is running at http://localhost:${express_port}`
    );
  })
);
