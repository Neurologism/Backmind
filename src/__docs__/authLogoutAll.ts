export const authLogoutAll = {
  post: {
    summary: 'Invalidate all tokens of a user. ',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description: 'In development',
    deprecated: true,
  },
};
