import request from 'supertest';
import app from './src/app';
import { z } from 'zod';

const responseSchema = z.object({
  token: z.string(),
});

const registerTestUser = async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      user: {
        email: 'test@test.com',
        brainet_tag: 'test',
        plain_password: 'test1234',
      },
    });

  responseSchema.parseAsync(response.body);

  return response.body.token;
};

declare global {
  var authToken: string;
}

beforeAll(async () => {
  const token = await registerTestUser();
  console.log(token);
  global.authToken = token;
});
