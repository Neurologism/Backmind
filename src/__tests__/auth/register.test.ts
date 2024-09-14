import request from 'supertest';
import app from '../../app';
import { z } from 'zod';

const registerResponseSchema = z.object({
  token: z.string(),
});

describe('POST /api/auth/register', () => {
  it('should return a valid auth token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        user: {
          email: 'randomuser@test.com',
          brainet_tag: 'randomuser',
          plain_password: 'test1234',
        },
      });

    expect(response.status).toBe(201);

    const validationResult = await registerResponseSchema.safeParseAsync(response.body);
    expect(validationResult.success).toBe(true);
  });
});
