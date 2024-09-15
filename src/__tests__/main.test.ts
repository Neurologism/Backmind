import request from 'supertest';
import { z } from 'zod';
import app from '../app';
import { componentsSchema } from '../schemas/componentsSchemas';

const registerResponseSchema = z.object({
  token: z.string(),
});

let authToken: string;
let projectId: string;

describe('POST /api/auth/register', () => {
  it('should return a valid auth token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        user: {
          email: 'test@test.com',
          brainet_tag: 'test',
          plain_password: 'test1234',
        },
      });

    expect(response.status).toBe(201);

    const validationResult = await registerResponseSchema.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
});

const loginResponseSchema = z
  .object({
    token: z.string(),
  })
  .strict();

describe('POST /api/auth/login', () => {
  it('should return a valid auth token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        user: {
          email: 'test@test.com',
          brainet_tag: 'test',
          plain_password: 'test1234',
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await loginResponseSchema.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
    authToken = response.body.token;
  });
});

describe('POST /api/user/is-taken', () => {
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
});

const getSelfUserResponseScheme = z
  .object({
    user: z
      .object({
        _id: z.string(),
        email: z.string(),
        date_of_birth: z.number(),
        brainet_tag: z.string(),
        displayname: z.string(),
        about_you: z.string(),
        visibility: z.string(),
        created_on: z.number(),
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
        brainet_tag: z.string(),
        displayname: z.string(),
        about_you: z.string(),
        visibility: z.string(),
        created_on: z.number(),
        project_ids: z.array(z.string()),
        follower_ids: z.array(z.string()),
        following_ids: z.array(z.string()),
      })
      .strict(),
  })
  .strict();

describe('POST /api/user/get', () => {
  it('should return the logged in user', async () => {
    const response = await request(app)
      .post('/api/user/get')
      .set(`Authorization`, `Bearer ${authToken}`)
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
});

describe('POST /api/user/update', () => {
  it('should update the user currently logged in', async () => {
    const response = await request(app)
      .post('/api/user/update')
      .set(`Authorization`, `Bearer ${authToken}`)
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
      .set(`Authorization`, `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user.about_you).toBe('changed');
    expect(response.body.user.displayname).toBe('changed');
    expect(response.body.user.visibility).toBe('private');
  });
});

const createProjectResponseScheme = z
  .object({
    project: z
      .object({
        _id: z.string(),
      })
      .strict(),
    msg: z.string().optional(),
  })
  .strict();

describe('POST /api/project/create', () => {
  it('should create a project', async () => {
    const response = await request(app)
      .post('/api/project/create')
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({
        project: {
          name: 'randomproject',
          description: 'this is a project',
          visibility: 'private',
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await createProjectResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
    projectId = response.body.project._id;
  });
});

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
        camera_position: z.tuple([z.number(), z.number(), z.number()]),
        components: componentsSchema,
      })
      .strict(),
  })
  .strict();

describe('POST /api/project/get', () => {
  it('should return a project', async () => {
    const response = await request(app)
      .post('/api/project/get')
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({
        project: {
          _id: projectId,
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await getProjectResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });
});

const updateProjectResponseScheme = z
  .object({
    msg: z.string(),
  })
  .strict();

describe('POST /api/project/update', () => {
  it('should update a project', async () => {
    const response = await request(app)
      .post('/api/project/update')
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({
        project: {
          _id: projectId,
          name: 'changed',
          description: 'changed',
          visibility: 'public',
          plain_password: 'test1234',
          camera_position: [1, 1, 1],
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await updateProjectResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
  });

  it('should match the updated project', async () => {
    const response = await request(app)
      .post('/api/project/get')
      .set(`Authorization`, `Bearer ${authToken}`)
      .send({
        project: {
          _id: projectId,
        },
      });

    expect(response.status).toBe(200);

    const validationResult = await getProjectResponseScheme.safeParseAsync(
      response.body
    );
    expect(validationResult.success).toBe(true);
    expect(response.body.project.name).toBe('changed');
    expect(response.body.project.description).toBe('changed');
    expect(response.body.project.visibility).toBe('public');
  });
});
