export const projectModelTrainingStop = {
  post: {
    summary: 'Stop model training.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description: 'Use this endpoint to stop the training process for a model.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              model: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    description:
                      'The ID of the model for which to stop the training.',
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
        description: 'Training stopped successfully.',
      },
      '400': {
        description: 'Invalid input.',
      },
      '404': {
        description: 'Project or model not found.',
      },
      '500': {
        description: 'Internal server error.',
      },
    },
  },
};
