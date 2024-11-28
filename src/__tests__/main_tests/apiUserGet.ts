import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const getSelfUserResponseScheme = z
  .object({
    user: z
      .object({
        _id: z.string(),
        email: z.string(),
        about_you: z.string(),
        date_of_birth: z.number(),
        brainet_tag: z.string(),
        displayname: z.string(),
        visibility: z.string(),
        created_on: z.string(),
        last_edited: z.string(),
        project_ids: z.array(z.string()),
        follower_ids: z.array(z.string()),
        following_ids: z.array(z.string()),
      })
      .strict(),
  })
  .strict();

const getOtherUserResponseScheme = z
  .object({
    user: z
      .object({
        _id: z.string(),
        about_you: z.string(),
        displayname: z.string(),
        brainet_tag: z.string(),
        visibility: z.string(),
        last_edited: z.string(),
        created_on: z.string(),
        project_ids: z.array(z.string()),
        follower_ids: z.array(z.string()),
        following_ids: z.array(z.string()),
      })
      .strict(),
  })
  .strict();

export default (app: Express, vars: any) => {
  it('should return the logged in user', async () => {
    const response = await request(app)
      .post('/api/user/get')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({});

    expect(response.status).toBe(200);

    const validationResult = await getSelfUserResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
  it('should return a user by brainet_tag', async () => {
    const response = await request(app)
      .post('/api/user/get')
      .send({ user: { brainet_tag: 'test' } });

    expect(response.status).toBe(200);

    const validationResult = await getOtherUserResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
};
