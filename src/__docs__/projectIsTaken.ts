export const projectIsTaken = {
  post: {
    summary: 'Check if a project name is already taken.',
    description:
      'This api endpoint is used to check if a certain project name is still available. This is always for the user you provided an auth token for. You need to provide an auth token.',
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
                },
              },
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Project name available.',
      },
      '400': {
        description: 'Invalid input.',
      },
      '401': {
        description: 'Not logged in.',
      },
      '409': {
        description: 'Project name in use.',
      },
      '500': {
        description: 'Internal server error.',
      },
    },
  },
};
