export const projectModelTrainingStart = {
  post: {
    summary: 'Start model training.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description: 'Use this endpoint to start the training process for a model.',
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
                    description:
                      'The Id of the project for which to start the training.',
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
        description: 'Training started successfully.',
      },
      '400': {
        description: 'Invalid input.',
      },
      '403': {
        description: 'Training queue is full. Try again later.',
      },
      '404': {
        description: 'Project not found.',
      },
      '500': {
        description: 'Internal server error.',
      },
    },
  },
};
