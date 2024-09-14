import request from 'supertest';
import app from './src/app';
import { z } from 'zod';

const registerResponseSchema = z.object({
  token: z.string(),
});

const createProjectResponseScheme = z.object({
  project: z.object({
    _id: z.string(),
  }),
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

  expect(response.status).toBe(201);

  const validationResult = await registerResponseSchema.safeParseAsync(
    response.body
  );
  expect(validationResult.success).toBe(true);

  return response.body.token;
};

const createTestProject = async () => {
  const response = await request(app)
    .post('/api/project/create')
    .set(`Authorization`, `Bearer ${global.authToken}`)
    .send({
      project: {
        name: 'testproject',
        description: 'this is a project',
        visibility: 'private',
      },
    });

  expect(response.status).toBe(200);

  const validationResult = await createProjectResponseScheme.safeParseAsync(
    response.body
  );
  expect(validationResult.success).toBe(true);

  return response.body.project._id;
};

declare global {
  var authToken: string;
  var projectId: string;
}

beforeAll(async () => {
  global.authToken = await registerTestUser();
  global.projectId = await createTestProject();
});
