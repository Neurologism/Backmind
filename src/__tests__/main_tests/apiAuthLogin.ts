import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const loginResponseSchema = z
  .object({
    token: z.string(),
  })
  .strict();

export default (app: Express, vars: any) => {
  it('should return a valid auth token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        user: {
          email: 'test@test.com',
          brainetTag: 'test',
          plainPassword: 'test1234',
        },
      });

    console.log(response.body);

    expect(response.status).toBe(200);

    const validationResult = await loginResponseSchema.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);

    vars['authToken'] = response.body.token;
  });
};
