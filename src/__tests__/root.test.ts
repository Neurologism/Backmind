import request from 'supertest';
import app from '../app';
import { z } from 'zod';

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
