import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express Typescript API with Swagger',
    version: '1.0.0',
    description: 'API documentation for Express server',
  },
  servers: [
    {
      url: 'https://backmind.icinoxis.net:3000',
      description: 'Dev server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/server.ts', './src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
