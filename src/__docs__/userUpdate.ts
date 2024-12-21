export const userUpdate = {
  post: {
    summary: 'Change account information.',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description:
      "Use this, if you want to change account information, like email, about you, displayname, brainetTag, password, dateOfBirth, visibility. You can only change the account data if you're logged in as the corresponding user. If you want to change the password, you will have to provide the old password. The minimum password length is 6, the minimum brainet tag length is 3.",
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
                  brainetTag: {
                    type: 'string',
                    description:
                      "Use '/api/user/is-taken' to make sure this brainet tag isn't already taken.",
                  },
                  email: {
                    type: 'string',
                    description:
                      "Use '/api/user/is-taken' to make sure the email isn't already in use.",
                  },
                  aboutYou: {
                    type: 'string',
                  },
                  displayname: {
                    type: 'string',
                  },
                  dateOfBirth: {
                    type: 'integer',
                    description:
                      'This needs to be a valid unix timestamp of the day.',
                  },
                  visibility: {
                    type: 'string',
                    description: 'either private or public',
                    example: 'private or public',
                  },
                  newPassword: {
                    type: 'string',
                  },
                  oldPassword: {
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
};
