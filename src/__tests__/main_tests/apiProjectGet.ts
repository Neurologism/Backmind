import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';
import { componentsSchema } from '../../zodSchemas/componentsSchemas';

const getProjectResponseScheme = z
  .object({
    project: z
      .object({
        _id: z.string(),
        name: z.string(),
        description: z.string(),
        owner_id: z.string(),
        contributors: z.array(z.string()),
        visibility: z.string(),
        created_on: z.number(),
        last_edited: z.number(),
        components: componentsSchema,
        models: z.array(z.string()),
      })
      .strict(),
  })
  .strict();

export default (app: Express, vars: any) => {
  it('should return a project', async () => {
    const response = await request(app)
      .post('/api/project/get')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({
        project: {
          _id: vars.projectId,
        },
      });

    expect(response.status).toBe(200);

    console.log(response.body);

    const validationResult = await getProjectResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
};
