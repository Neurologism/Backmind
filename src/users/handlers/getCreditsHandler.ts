import { UserDocument } from '../../../mongooseSchemas/user.schema';

export const getCreditsHandler = async (user: UserDocument) => {
  return { remainingCredits: user.remainingCredits };
};
