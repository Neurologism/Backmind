import request from 'supertest';
import { Express } from 'express';

export default (app: Express, vars: any) => {
  it('should update the user currently logged in', async () => {
    const response = await request(app)
      .post('/api/user/update')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({
        user: {
          about_you: 'changed',
          displayname: 'changed',
          visibility: 'private',
          new_password: 'test1234',
          old_password: 'test1234',
        },
      });

    expect(response.status).toBe(200);
  });

  it('should match the updated user', async () => {
    const response = await request(app)
      .post('/api/user/get')
      .set(`Authorization`, `Bearer ${vars.authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user.about_you).toBe('changed');
    expect(response.body.user.displayname).toBe('changed');
    expect(response.body.user.visibility).toBe('private');
  });
};
