import parameter from './parameter';

const components = {
  type: 'object',
  properties: {
    add: {
      type: 'object',
      properties: {
        modules: {
          type: 'array',
          items: parameter,
        },
        connections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              from: {
                type: 'string',
                example: 'module1',
              },
              to: {
                type: 'string',
                example: 'module2',
              },
            },
          },
        },
      },
    },
    train: {
      type: 'object',
      properties: {
        parameters: {
          type: 'array',
          items: parameter,
        },
      },
    },
    predict: {
      type: 'object',
      properties: {
        parameters: {
          type: 'array',
          items: parameter,
        },
      },
    },
  },
};

export default components;
