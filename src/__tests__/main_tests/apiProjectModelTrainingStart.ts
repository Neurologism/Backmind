import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const startTrainingResponseScheme = z
  .object({
    msg: z.string(),
    model: z
      .object({
        _id: z.string(),
      })
      .strict(),
  })
  .strict();

export default (app: Express, vars: any) => {
  it('should start a model training', async () => {
    const response = await request(app)
      .post('/api/project/model/training-start')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({
        project: {
          _id: vars.projectId,
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await startTrainingResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);

    vars.modelId = response.body.model._id;
  });
};
