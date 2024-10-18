export const authCheck = {
  get: {
    summary: 'Check if a user is logged in.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description:
      'This method provides a simple check if the auth token provided is valid. ',
    responses: {
      '200': {
        description: 'Request validated',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                loggedIn: {
                  type: 'boolean',
                  description:
                    'Indicates whether the user is logged in or not. ',
                  example: 'true | false',
                },
              },
            },
          },
        },
      },
    },
  },
};
