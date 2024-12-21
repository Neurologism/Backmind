export const projectCreate = {
  post: {
    summary: 'Used to create a project.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description:
      'To create a project, you have to be logged in and provide your auth token. Furthermore, you have to specify name, description, and visibility. The description can be an empty string. The visibility can be either public or private.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              project: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  description: {
                    type: 'string',
                  },
                  visibility: {
                    type: 'string',
                    description: 'either private or public',
                    example: 'private or public',
                  },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Project created successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                project: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      example: '029iiu73h4t42e5t29io0u3h45t',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Invalid input.',
      },
      '500': {
        description: 'Internal server error.',
      },
    },
  },
};
