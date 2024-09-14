import request from 'supertest';
import app from '../../app';
import { z } from 'zod';

const rootResponseSchema = z.object({
  token: z.string(),
});

describe('POST /api/auth/login', () => {
  it('should return a valid auth token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        user: {
          email: 'test@test.com',
          brainet_tag: 'test',
          plain_password: 'test1234',
        },
      });

    expect(response.status).toBe(200);

    const validationResult = rootResponseSchema.safeParse(response.body);
    expect(validationResult.success).toBe(true);
  });
});
