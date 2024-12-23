import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

const getSelfUserResponseScheme = z
  .object({
    user: z
      .object({
        _id: z.string(),
        aboutYou: z.string(),
        dateOfBirth: z.string().optional(),
        displayname: z.string(),
        brainetTag: z.string(),
        visibility: z.string(),
        projectIds: z.array(z.string()),
        followerIds: z.array(z.string()),
        followingIds: z.array(z.string()),
        emails: z.array(
          z
            .object({
              emailType: z.string(),
              address: z.string(),
              verified: z.boolean(),
            })
            .strict()
        ),
        remainingCredits: z.number(),
      })
      .strict(),
  })
  .strict();

const getOtherUserResponseScheme = z
  .object({
    user: z
      .object({
        _id: z.string(),
        aboutYou: z.string(),
        displayname: z.string(),
        brainetTag: z.string(),
        visibility: z.string(),
        projectIds: z.array(z.string()),
        followerIds: z.array(z.string()),
        followingIds: z.array(z.string()),
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
  it('should return a user by brainetTag', async () => {
    const response = await request(app)
      .post('/api/user/get')
      .send({ user: { brainetTag: 'test' } });

    expect(response.status).toBe(200);

    const validationResult = await getOtherUserResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
};
