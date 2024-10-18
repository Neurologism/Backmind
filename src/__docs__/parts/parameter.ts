const parameter = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    value: {
      type: 'string, number',
      example: 'string or number',
    },
    parameters: {
      type: 'array',
      items: {
        type: 'object',
        description: 'This will be a parameter object. (recursive structure)',
      },
    },
  },
};

export default parameter;
