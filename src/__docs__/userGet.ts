export const userGet = {
  post: {
    summary: 'Retrieve a user.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description:
      'Use this to get a user by id or brainet_tag. If you want to get the user that is currently logged in, you leave the body empty, but make sure to include your token. If you want to get a user that has the account visibility set to private, the user will have to be a follower of you and you will also have to include your auth token.',
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
                  brainet_tag: {
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
                    brainet_tag: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                    },
                    about_you: {
                      type: 'string',
                    },
                    displayname: {
                      type: 'string',
                    },
                    date_of_birth: {
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
                    project_ids: {
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
