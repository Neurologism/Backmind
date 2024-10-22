import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const stopTrainingResponseScheme = z
  .object({
    msg: z.string(),
  })
  .strict();

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
  it('should stop the training', async () => {
    const response = await request(app)
      .post('/api/project/model/training-stop')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({
        model: {
          _id: vars.modelId,
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await stopTrainingResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });

  it('should match the stopped training', async () => {
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

    expect(response.body.model.status).toBe('stopped');
  });
};
