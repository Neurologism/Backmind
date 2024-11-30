import request from 'supertest';
import { z } from 'zod';
import { Express } from 'express';
import { componentsSchema } from '../../zodSchemas/componentsSchemas';

const updateProjectResponseScheme = z
  .object({
    msg: z.string(),
  })
  .strict();

const getProjectResponseScheme = z
  .object({
    project: z
      .object({
        _id: z.string(),
        name: z.string(),
        description: z.string(),
        ownerId: z.string(),
        contributors: z.array(z.string()),
        visibility: z.string(),
        dateCreatedOn: z.string(),
        dateLastEdited: z.string(),
        components: componentsSchema,
        models: z.array(z.string()),
      })
      .strict(),
  })
  .strict();

export default (app: Express, vars: any) => {
  it('should update a project', async () => {
    const response = await request(app)
      .post('/api/project/update')
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({
        project: {
          _id: vars.projectId,
          name: 'changed',
          description: 'changed',
          visibility: 'public',
          plainPassword: 'test1234',
          // components: JSON.parse(
          //   fs.readFileSync(
          //     '../src/__tests__/brainetTasks/slowTask.json',
          //     'utf8'
          //   )
          // ).components,
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
      .set(`Authorization`, `Bearer ${vars.authToken}`)
      .send({
        project: {
          _id: vars.projectId,
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
};
