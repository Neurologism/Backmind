import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const statusTrainingResponseScheme = z
  .object({
    model: z
      .object({
        status: z.string(),
        output: z.array(z.any()),
        queued_at: z.number(),
        started_at: z.number().nullable(),
        finished_at: z.number().nullable(),
        error: z.any(),
        project_id: z.string(),
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
