export const initComponents = () => {
  const components = {
    add: {
      modules: [
        {
          type: 'dense',
          position: [10, 50],
          parameters: [
            { type: 'object', value: 'relu' },
            { type: 'parameter', value: 100 },
            { type: 'parameter', value: 'module1' },
          ],
        },
        {
          type: 'dense',
          position: [100, 200],
          parameters: [
            { type: 'object', value: 'softmax' },
            { type: 'parameter', value: 10 },
            { type: 'parameter', value: 'module2' },
          ],
        },
        {
          type: 'loss',
          position: [300, 400],
          parameters: [
            { type: 'object', value: 'error_rate' },
            { type: 'parameter', value: 'module3' },
          ],
        },
      ],
      connections: [
        { from: 'module1', to: 'module2' },
        { from: 'module2', to: 'module3' },
      ],
    },
    train: {
      parameters: [
        { type: 'parameter', value: 'module1' },
        { type: 'parameter', value: 'module3' },
        { type: 'parameter', value: 10 },
        { type: 'parameter', value: 128 },
        {
          type: 'object',
          value: 'sgd',
          parameters: [
            { type: 'parameter', value: 0.1 },
            { type: 'parameter', value: 500 },
          ],
        },
        { type: 'parameter', value: 10 },
      ],
    },
    predict: {
      parameters: [
        { type: 'parameter', value: 'module1' },
        { type: 'parameter', value: 'module3' },
      ],
    },
  };
  return components;
};
