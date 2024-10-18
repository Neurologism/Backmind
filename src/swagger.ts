import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import {
  authCheck,
  authLogin,
  authLogout,
  authLogoutAll,
  authRegister,
  projectCreate,
  projectDelete,
  projectGet,
  projectModelDownload,
  projectModelQuery,
  projectModelTrainingStart,
  projectModelTrainingStatus,
  projectModelTrainingStop,
  projectSearch,
  projectUpdate,
  root,
  userDelete,
  userFollow,
  userGet,
  userIsTaken,
  userSearch,
  userUnfollow,
  userUpdate,
} from './__docs__';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express Typescript API with Swagger',
    version: '1.0.0',
    description: 'API documentation for Express server',
  },
  servers: [
    {
      url: 'https://api.whitemind.net',
      description: 'Deployment server',
    },
    {
      url: 'https://backmind.icinoxis.net',
      description: 'Developement server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/check': authCheck,
    '/api/auth/login': authLogin,
    '/api/auth/logout': authLogout,
    '/api/auth/logout-all': authLogoutAll,
    '/api/auth/register': authRegister,
    '/api/project/create': projectCreate,
    '/api/project/delete': projectDelete,
    '/api/project/get': projectGet,
    '/api/project/model/download': projectModelDownload,
    '/api/project/model/query': projectModelQuery,
    '/api/project/model/training-start': projectModelTrainingStart,
    '/api/project/model/training-status': projectModelTrainingStatus,
    '/api/project/model/training-stop': projectModelTrainingStop,
    '/api/project/search': projectSearch,
    '/api/project/update': projectUpdate,
    '/': root,
    '/api/user/delete': userDelete,
    '/api/user/follow': userFollow,
    '/api/user/get': userGet,
    '/api/user/is-taken': userIsTaken,
    '/api/user/search': userSearch,
    '/api/user/unfollow': userUnfollow,
    '/api/user/update': userUpdate,
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
