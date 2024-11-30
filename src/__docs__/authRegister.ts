export const authRegister = {
  post: {
    summary: 'Register a new user.',
    description:
      'Use this endpoint to register a new user. You can use the /api/user/is-taken endpoint to make sure the brainet tag and email address are still available. To create a new user, you absolutely need to specify email, brainet tag and password. The minimum password length is 6, the minimum brainet tag length is 3. ',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'max@mustermann.net',
                  },
                  brainetTag: {
                    type: 'string',
                    example: 'randomuser1234',
                  },
                  plainPassword: {
                    type: 'string',
                    example: 'password123',
                  },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'Successfully registered',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description:
                    'Use this token for further requests under the Authorization header.',
                  example: 'eyJhbGciOi0298i718u345hgtr',
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
        description: 'Internal server error',
      },
    },
  },
};
