import request from 'supertest';
import app from '../../app';
import { z } from 'zod';

const createProjectResponseScheme = z.object({
  project: z.object({
    _id: z.string(),
  }),
});

describe('POST /api/project/create', () => {
  it('should create a project', async () => {
    const response = await request(app)
      .post('/api/project/create')
      .set(`Authorization`, `Bearer ${global.authToken}`)
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
  });
});
