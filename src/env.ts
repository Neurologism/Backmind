import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

export const setEnv = (filename: string = '.env') => {
  dotenv.config({ path: filename });

  if (!process.env.MONGO_URI) {
    console.warn('WARNING: MONGO_URI must be set in .env file');
  }
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('WARNING: SENDGRID_API_KEY should be set');
  }

  if (!process.env.SECRET_KEY) {
    console.warn('WARNING: SECRET_KEY should be set');
  }

  process.env.PORT = process.env.PORT || '3000';
  process.env.JWT_SECRET =
    process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
  process.env.SALT_ROUNDS = process.env.SALT_ROUNDS || '10';
  process.env.MIN_PASS_LENGTH = process.env.MIN_PASS_LENGTH || '6';
  process.env.MIN_BRAINET_TAG_LENGTH =
    process.env.MIN_BRAINET_TAG_LENGTH || '3';
  process.env.MIN_PROJECT_NAME_LENGTH =
    process.env.MIN_PROJECT_NAME_LENGTH || '1';
  process.env.SEND_ERR_TO_CLIENT =
    process.env.SEND_ERR_TO_CLIENT === 'true' ? 'true' : '';
  process.env.RESET_DB = process.env.RESET_DB === 'true' ? 'true' : '';
  process.env.JWT_TOKEN_EXPIRE_IN = process.env.JWT_TOKEN_EXPIRE_IN || '24h';
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  process.env.DB_NAME = process.env.DB_NAME || 'backmind';
  process.env.RATE_LIMIT_DURATION = process.env.RATE_LIMIT_DURATION || '5';
  process.env.RATE_LIMIT_REQUESTS = process.env.RATE_LIMIT_REQUESTS || '1000';
  process.env.NODE_ENV =
    process.env.NODE_ENV === 'development' ? 'development' : 'production';
  process.env.DISABLE_ACCOUNT_CREATION =
    process.env.DISABLE_ACCOUNT_CREATION === 'true' ? 'true' : '';
  process.env.FILES_DIRECTORY =
    process.env.FILES_DIRECTORY || path.join(process.cwd(), './dataStorage');
  process.env.PFP_DIRECTORY =
    process.env.PFP_DIRECTORY ||
    path.join(process.env.FILES_DIRECTORY as string, '/pfp');
  process.env.MODEL_DIRECTORY =
    process.env.MODEL_DIRECTORY ||
    path.join(process.env.FILES_DIRECTORY as string, '/model');
  process.env.BACKMIND_HOSTNAME =
    process.env.BACKMIND_HOSTNAME || 'https://backmind.icinoxis.net/';
  process.env.WHITEMIND_HOSTNAME =
    process.env.WHITEMIND_HOSTNAME || 'https://whitemind.icinoxis.net/';
  process.env.VERIFY_ALL_EMAILS =
    process.env.VERIFY_ALL_EMAILS === 'false' ? 'false' : 'true';
  process.env.EMAIL_VERIFICATION_TOKEN_VALID_MINUTES =
    process.env.EMAIL_VERIFICATION_TOKEN_VALID_MINUTES || '60';
  process.env.MAX_TOKENS = process.env.MAX_TOKENS || '5';
  process.env.MAX_PFP_SIZE = process.env.MAX_PFP_SIZE || '2048';
  process.env.PFP_SAVE_SIZE = process.env.PFP_SAVE_SIZE || '128';
  process.env.WRITE_PROJECT_JSON = process.env.WRITE_PROJECT_JSON || 'false';
  process.env.DISCORD_LOGGING = process.env.DISCORD_LOGGING || 'true';
  process.env.HOST = process.env.HOST || '0.0.0.0';
};
