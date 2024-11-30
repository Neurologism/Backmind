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
  process.env.EXPRESS_PORT = process.env.EXPRESS_PORT || '3000';
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
    process.env.NODE_ENV === 'developement' ? 'developement' : 'production';
  process.env.DISABLE_ACCOUNT_CREATION =
    process.env.DISABLE_ACCOUNT_CREATION === 'true' ? 'true' : '';
  process.env.FILES_DIRECTORY = process.env.FILES_DIRECTORY || './dataStorage';
  process.env.PFP_DIRECTORY =
    process.env.PFP_DIRECTORY ||
    path.join(process.env.FILES_DIRECTORY as string, '/pfp');
  process.env.BACKEND_HOSTNAME =
    process.env.BACKEND_HOSTNAME || 'https://api.whitemind.net/';
  process.env.WHITEMIND_HOSTNAME =
    process.env.WHITEMIND_HOSTNAME || 'https://whitemind.net/';
  process.env.VERIFY_ALL_EMAILS =
    process.env.VERIFY_ALL_EMAILS === 'true' ? 'true' : '';
};
