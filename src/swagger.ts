import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const parameter = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
    },
    value: {
      type: 'any',
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

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express Typescript API with Swagger',
    version: '1.0.0',
    description: 'API documentation for Express server',
  },
  servers: [
    {
      url: 'https://backmind.icinoxis.net',
      description: 'deployment server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  paths: {
    '/': {
      get: {
        summary: 'test the api',
        responses: {
          '200': {
            description: 'working',
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Register a new user.',
        description:
          'Use this endpoint to register a new user. You can use the /api/user/is-taken endpoint to make sure the brainet tag and email address are still available. To create a new user, you absolutely need to specify email, brainet tag and password. The minimum password length is 6, the minimum brainet tag length is 3. ',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                        example: 'max@mustermann.net',
                      },
                      brainet_tag: {
                        type: 'string',
                        example: 'randomuser1234',
                      },
                      plain_password: {
                        type: 'string',
                        example: 'password123',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Successfully registered',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      description:
                        'Use this token for further requests under the Authorization header.',
                      example: 'eyJhbGciOi0298i718u345hgtr',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid input.',
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login a user.',
        description:
          'Use this method to login as a user. You need to provide the email or brainet tag and plain password. ',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                        example: 'max@mustermann.net',
                      },
                      brainet_tag: {
                        type: 'string',
                        example: 'randomuser1234',
                      },
                      plain_password: {
                        type: 'string',
                        example: 'password123',
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
            description: 'Successfully logged in',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      description:
                        'Use this token for further requests under the Authorization header.',
                      example: 'eyJhbGciOi0298i718u345hgtr',
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'User not found',
          },
          '401': {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        summary: 'Logout a user.',
        description: 'In development',
        deprecated: true,
      },
    },
    '/api/project/get': {
      post: {
        summary: 'Used to get a project.',
        description:
          'This returns a project including its operations and other relevant information like last edited date. If the project is private, you need to be logged in and an owner or contributor to access it.',
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
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Project retrieved successfully.',
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
                        owner_id: {
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
                        },
                        created_on: {
                          type: 'integer',
                        },
                        last_edited: {
                          type: 'integer',
                        },
                        camera_position: {
                          type: 'array',
                          items: {
                            type: 'number',
                          },
                          example: [0, 0, 0],
                        },
                        components: components,
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
            description:
              'No project found matching the criteria or not logged in.',
          },
          '500': {
            description: 'Internal server error.',
          },
        },
      },
    },
    '/api/project/update': {
      post: {
        summary: "Used to change a project's properties.",
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
                      owner_id: {
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
                      },
                      plain_password: {
                        type: 'string',
                      },
                      camera_position: {
                        type: 'array',
                        items: {
                          type: 'number',
                        },
                        example: [0, 0, 0],
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
            description:
              'No project found matching the criteria or not logged in.',
          },
          '500': {
            description: 'Internal server error.',
          },
        },
      },
    },
    '/api/project/create': {
      post: {
        summary: 'Used to create a project.',
        description:
          'To create a project, you have to be logged in and provide your auth token. Furthermore, you have to specify name, description, and visibility. The description can be an empty string. The visibility can be either public or private.',
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
                      name: {
                        type: 'string',
                      },
                      description: {
                        type: 'string',
                      },
                      visibility: {
                        type: 'string',
                        description: 'either private or public',
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
            description: 'Project created successfully.',
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
                          example: '029iiu73h4t42e5t29io0u3h45t',
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
          '500': {
            description: 'Internal server error.',
          },
        },
      },
    },
    '/api/project/delete': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/project/search': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/project/model/training-start': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/project/model/training-stop': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/project/model/training-status': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/project/model/query': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/project/model/download': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/user/get': {
      post: {
        summary: 'Retrieve a user.',
        description:
          'Use this to get a user by id or brainet_tag. If you want to get the user that is currently logged in, you leave the body empty, but make sure to include your token. If you want to get a user that has the account visibility set to private, the user will have to be a follower of you and you will also have to include your auth token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                      },
                      brainet_tag: {
                        type: 'string',
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
            description: 'User retrieved successfully.',
          },
          '400': {
            description: 'Invalid input.',
          },
          '404': {
            description: 'No user found matching the criteria.',
          },
          '500': {
            description: 'Internal server error.',
          },
        },
      },
    },
    '/api/user/update': {
      post: {
        summary: 'Change account information.',
        description:
          "Use this, if you want to change account information, like email, about you, displayname, brainet_tag, password, date_of_birth, visibility. You can only change the account data if you're logged in as the corresponding user. If you want to change the password, you will have to provide the old password. The minimum password length is 6, the minimum brainet tag length is 3.",
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      brainet_tag: {
                        type: 'string',
                        description:
                          "Use '/api/user/is-taken' to make sure this brainet tag isn't already taken.",
                      },
                      email: {
                        type: 'string',
                        description:
                          "Use '/api/user/is-taken' to make sure the email isn't already in use.",
                      },
                      about_you: {
                        type: 'string',
                      },
                      displayname: {
                        type: 'string',
                      },
                      date_of_birth: {
                        type: 'integer',
                        description:
                          'This needs to be a valid unix timestamp of the day.',
                      },
                      visibility: {
                        type: 'string',
                        description:
                          "This needs to be either 'private' or 'public'.",
                      },
                      new_password: {
                        type: 'string',
                      },
                      old_password: {
                        type: 'string',
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
            description: 'User updated successfully.',
          },
          '400': {
            description: 'Invalid input.',
          },
          '500': {
            description: 'Internal server error.',
          },
        },
      },
    },
    '/api/user/is-taken': {
      post: {
        summary: 'Check if an email or brainet tag is taken.',
        description:
          "This api endpoint is used to show the user just after he finished typing in his potentially new email or brainet tag if it is available or it isn't.",
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      brainet_tag: {
                        type: 'string',
                      },
                      email: {
                        type: 'string',
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
            description: 'The email or brainet tag is not in use yet.',
          },
          '400': {
            description: 'Invalid input.',
          },
          '409': {
            description: 'The email or brainet tag is already in use.',
          },
          '500': {
            description: 'Internal server error.',
          },
        },
      },
    },
    '/api/user/search': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/user/delete': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/user/follow': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
    '/api/user/unfollow': {
      post: {
        summary: 'in development',
        deprecated: true,
      },
    },
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
