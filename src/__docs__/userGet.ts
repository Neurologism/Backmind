export const userGet = {
  post: {
    summary: 'Retrieve a user.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description:
      'Use this to get a user by id or brainetTag. If you want to get the user that is currently logged in, you leave the body empty, but make sure to include your token. If you want to get a user that has the account visibility set to private, the user will have to be a follower of you and you will also have to include your auth token.',
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
                  _id: {
                    type: 'string',
                  },
                  brainetTag: {
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
        description: 'User retrieved successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                    },
                    brainetTag: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                    },
                    aboutYou: {
                      type: 'string',
                    },
                    displayname: {
                      type: 'string',
                    },
                    dateOfBirth: {
                      type: 'integer',
                    },
                    visibility: {
                      type: 'string',
                      description: 'either private or public',
                      example: 'private or public',
                    },
                    followers: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    following: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    projectIds: {
                      type: 'array',
                      items: {
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
      },
      '400': {
        description: 'Invalid input.',
      },
      '404': {
        description: 'No user found matching the criteria.',
      },
      '500': {
        description: 'Internal server error.',
      },
    },
  },
};
