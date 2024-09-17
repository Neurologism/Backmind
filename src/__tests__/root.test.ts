import { z } from 'zod';
import request from 'supertest';
import { setEnv } from '../env';

setEnv('.env.test');
setEnv();

import app from '../app';

const rootResponseSchema = z
  .object({
    msg: z.string(),
  })
  .strict();

describe('GET /', () => {
  it('should return a greeting message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);

    const validationResult = rootResponseSchema.safeParse(response.body);
    expect(validationResult.success).toBe(true);
  });
});
