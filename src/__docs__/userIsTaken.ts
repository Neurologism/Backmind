export const userIsTaken = {
  post: {
    summary: 'Check if an email or brainet tag is taken.',
    description:
      "This api endpoint is used to show the user just after he finished typing in his potentially new email or brainet tag if it is available or it isn't.",
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
                  brainetTag: {
                    type: 'string',
                  },
                  email: {
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
        description: 'The email or brainet tag is not in use yet.',
      },
      '400': {
        description: 'Invalid input.',
      },
      '409': {
        description: 'The email or brainet tag is already in use.',
      },
      '500': {
        description: 'Internal server error.',
      },
    },
  },
};
