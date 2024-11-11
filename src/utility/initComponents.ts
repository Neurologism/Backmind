export const initComponents = () => {
  const components = {
    operations: [
      {
        type: 'dataset',
        method: 'new',
        uid: 'dataset1',
        args: {
          class: 'mnist',
          split: 'train',
          preprocess: ['normalize'],
          batch_size: 32,
        },
      },
      {
        type: 'dataset',
        method: 'new',
        uid: 'dataset2',
        args: {
          class: 'mnist',
          split: 'test',
          preprocess: ['normalize'],
          batch_size: 32,
        },
      },
      {
        type: 'layer',
        method: 'new',
        uid: 'input1',
        args: {
          class: 'Input',
          shape: [28, 28],
        },
      },
      {
        type: 'layer',
        method: 'new',
        uid: 'flatten1',
        args: {
          class: 'Flatten',
        },
      },

      {
        type: 'layer',
        method: 'new',
        uid: 'layer1',
        args: {
          class: 'Dense',
          units: 10,
          activation: 'softmax',
        },
      },
      {
        type: 'model',
        method: 'new',
        uid: 'model1',
        args: {
          inputs: 'input1',
          outputs: 'layer1',
        },
      },
      {
        type: 'model',
        method: 'compile',
        uid: 'model1',
        args: {
          optimizer: {
            method: 'adam',
          },
          loss: [
            {
              method: 'sparse_categorical_crossentropy',
            },
          ],
          metrics: [
            {
              method: 'sparse_categorical_accuracy',
            },
          ],
        },
      },
      {
        type: 'model',
        method: 'fit',
        uid: 'model1',
        args: {
          dataset: 'dataset1',
          epochs: 1,
        },
      },
      {
        type: 'model',
        method: 'evaluate',
        uid: 'model1',
        args: {
          dataset: 'dataset2',
        },
      },
    ],
    links: [
      {
        uid: 'link1',
        source: 'input1',
        target: 'flatten1',
      },
      {
        uid: 'link2',
        source: 'flatten1',
        target: 'layer1',
      },
    ],
  };
  return components;
};
