import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const statusTrainingResponseScheme = z
  .object({
    model: z
      .object({
        status: z.string(),
        output: z.array(z.any()),
        dateQueued: z.number(),
        dateStarted: z.number().nullable(),
        dateFinished: z.number().nullable(),
        error: z.any(),
        projectId: z.string(),
      })
      .strict(),
  })
  .strict();

export default (app: Express, vars: any) => {
  it('should return the training status', async () => {
    const response = await request(app)
      .post('/api/project/model/training-status')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({
        model: {
          _id: vars.modelId,
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await statusTrainingResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
};
