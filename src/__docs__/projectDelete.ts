export const projectDelete = {
  post: {
    summary: 'Delete a project. ',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description:
      'To delete a project, you have to be logged in and provide your auth token. Furthermore, you have to specify the project id.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              project: {
                _id: 'object',
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
    responses: {
      '200': {
        description: 'Project deleted successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                msg: {
                  type: 'string',
                  example: 'Project deleted successfully.',
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
