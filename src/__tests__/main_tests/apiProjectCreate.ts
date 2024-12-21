import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const createProjectResponseScheme = z
  .object({
    project: z
      .object({
        _id: z.string(),
      })
      .strict(),
    msg: z.string().optional(),
  })
  .strict();

export default (app: Express, vars: any) => {
  it('should create a project', async () => {
    const response = await request(app)
      .post('/api/project/create')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
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
    vars.projectId = response.body.project._id;
  });
};
