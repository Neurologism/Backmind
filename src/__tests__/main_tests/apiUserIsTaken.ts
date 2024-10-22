import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';

export default (app: Express) => {
  it('this user should be taken', async () => {
    const response = await request(app)
      .post('/api/user/is-taken')
      .send({
        user: {
          email: 'test@test.com',
          brainet_tag: 'test',
        },
      });

    expect(response.status).toBe(409);
  });

  it('this user should not be taken', async () => {
    const response = await request(app)
      .post('/api/user/is-taken')
      .send({
        user: {
          email: 'random@random.com',
          brainet_tag: 'random',
        },
      });

    expect(response.status).toBe(200);
  });
};
