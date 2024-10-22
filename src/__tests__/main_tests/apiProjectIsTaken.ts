import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';
import { componentsSchema } from '../../schemas/componentsSchemas';

const getProjectResponseScheme = z
  .object({
    msg: z.string(),
  })
  .strict();

export default (app: Express, vars: any) => {
  it('should return 409 status code', async () => {
    const response = await request(app)
      .post('/api/project/is-taken')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({
        project: {
          name: 'randomproject',
        },
      });

    expect(response.status).toBe(409);

    const validationResult = await getProjectResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
};
