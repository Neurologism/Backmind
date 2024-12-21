export const authLogout = {
  post: {
    summary: 'Invalidate the current auth token of a user. ',
    security: [
      {
        bearerAuth: [],
      },
    ],
    description: 'In development',
    deprecated: true,
  },
};
