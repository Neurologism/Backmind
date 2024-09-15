import request from 'supertest';
import app from '../app';
import { z } from 'zod';

const registerResponseSchema = z.object({
  token: z.string(),
});

let authToken: string;
let projectId: string;

describe('POST /api/auth/register', () => {
  it('should return a valid auth token', async () => {
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
  });
});

const loginResponseSchema = z.object({
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

    const validationResult = await loginResponseSchema.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
    authToken = response.body.token;
  });
});

const createProjectResponseScheme = z.object({
  project: z.object({
    _id: z.string(),
  }),
});

describe('POST /api/project/create', () => {
  it('should create a project', async () => {
    const response = await request(app)
      .post('/api/project/create')
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({
        project: {
          name: 'randomproject',
          description: 'this is a project',
          visibility: 'private',
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await createProjectResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
    projectId = response.body.project._id;
  });
});
