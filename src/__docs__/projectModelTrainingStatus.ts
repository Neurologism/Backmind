export const projectModelTrainingStatus = {
  post: {
    summary: 'Get model training status.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description: 'Use this endpoint to get the training status of a model.',
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
                      'The Id of the model for which to get the training status.',
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
        description: 'Model training status retrieved successfully.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                model: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      description:
                        'either queued, training, finished, error or stopped',
                      example:
                        'either queued, training, finished, error or stopped',
                    },
                    output: {
                      type: 'string',
                    },
                    dateQueued: {
                      type: 'integer',
                      format: 0,
                    },
                    dateStarted: {
                      type: 'integer',
                      format: 0,
                    },
                    dateFinished: {
                      type: 'integer',
                      format: 0,
                    },
                    error: {
                      type: 'any',
                      example: 'any',
                    },
                    projectId: {
                      type: 'string',
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
        description: 'Project or model not found.',
      },
      '500': {
        description: 'Internal server error.',
      },
    },
  },
};
