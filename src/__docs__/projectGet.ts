import components from './parts/components';

export const projectGet = {
  post: {
    summary: 'Used to get a project.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description:
      'This returns a project including its operations and other relevant information like last edited date. If the project is private, you need to be logged in and an owner or contributor to access it.',
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
                  _id: {
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
        description: 'Project retrieved successfully.',
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
                    },
                    name: {
                      type: 'string',
                    },
                    description: {
                      type: 'string',
                    },
                    ownerId: {
                      type: 'string',
                    },
                    contributors: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                    visibility: {
                      type: 'string',
                      description: 'either private or public',
                      example: 'private or public',
                    },
                    dateCreatedOn: {
                      type: 'integer',
                    },
                    dateLastEdited: {
                      type: 'integer',
                    },
                    components: components,
                    models: {
                      type: 'array',
                      description:
                        'Array of model ids associated with that project',
                      items: {
                        type: 'string',
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
        description: 'No project found matching the criteria or not logged in.',
      },
      '500': {
        description: 'Internal server error.',
      },
    },
  },
};
