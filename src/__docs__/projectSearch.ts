export const projectSearch = {
  post: {
    summary: 'Search for multiple projects.',
    description:
      'This endpoint enables it to search for projects. You do not need to be logged in. You can only search for public projects. ',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              query: {
                type: 'object',
                properties: {
                  q: {
                    type: 'string',
                    description: 'The search query.',
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
        description: 'Search successful.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                projects: {
                  type: 'array',
                  items: [
                    {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        description: {
                          type: 'string',
                        },
                        owner_id: {
                          type: 'string',
                        },
                        visibility: {
                          type: 'string',
                          description: 'either private or public',
                          example: 'private or public',
                        },
                      },
                    },
                  ],
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
