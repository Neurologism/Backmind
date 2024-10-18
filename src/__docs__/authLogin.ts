export const authLogin = {
  post: {
    summary: 'Login a user.',
    description:
      'Use this method to login as a user. You need to provide the email or brainet tag and plain password. ',
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
                  brainet_tag: {
                    type: 'string',
                    example: 'randomuser1234',
                  },
                  plain_password: {
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
      '200': {
        description: 'Successfully logged in',
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
      '404': {
        description: 'User not found',
      },
      '401': {
        description: 'Invalid credentials',
      },
    },
  },
};
