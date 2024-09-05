import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './database';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import projectRoutes from './routes/project';
import crypto from 'crypto';
import { setupSwagger } from './swagger';
import cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);

setupSwagger(app);

const express_port = process.env.EXPRESS_PORT || 3000;
process.env.JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

/**
 * @swagger
 * /:
 *   get:
 *     summary: test the api
 *     responses:
 *       200:
 *         description: working
 */
app.get('/', async (req: Request, res: Response) => {
  res.send('Backbrain Express Server');
  return;
});

connectToDatabase().then(() =>
  app.listen(express_port, () => {
    console.log(
      `Express server is running at http://localhost:${express_port}`
    );
  })
);
