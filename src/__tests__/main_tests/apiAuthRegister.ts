import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const registerResponseSchema = z.object({
  token: z.string(),
});

export default (app: Express) => {
  it('should return a valid auth token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        user: {
          email: 'test@test.com',
          brainetTag: 'test',
          plainPassword: 'test1234',
        },
        agreedToTermsOfServiceAndPrivacyPolicy: true,
      });

    expect(response.status).toBe(201);

    const validationResult = await registerResponseSchema.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
};
