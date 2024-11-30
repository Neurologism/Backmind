import components from './parts/components';

export const projectUpdate = {
  post: {
    summary: "Used to change a project's properties.",
    security: [
      {
        bearerAuth: [],
      },
    ],
    description:
      "This method can be used to change most of a project's properties. You need to be logged in to change the project. If you are a contributor, you can change the project's description and operations. If you are the owner, you can change the name, description, visibility, contributors, operations, and even transfer ownership. If you want to transfer ownership, you need to provide your password. You always have to provide the project id.",
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
                  plainPassword: {
                    type: 'string',
                  },
                  components: components,
                },
              },
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Project changed successfully.',
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
