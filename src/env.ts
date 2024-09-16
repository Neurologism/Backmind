import crypto from 'crypto';
import dotenv from 'dotenv';

export const setEnv = (filename: string = '.env') => {
  dotenv.config({ path: filename });

  if (!process.env.MONGO_URI) {
    console.warn('WARNING: MONGO_URI must be set in .env file');
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
  process.env.RECOMPILE_BRAINET =
    process.env.RECOMPILE_BRAINET === 'true' ? 'true' : '';
  process.env.BRAINET_PATH =
    process.env.BRAINET_PATH || 'brainet/json_interface/';
  process.env.BRAINET_RUN_JSON_FILENAME =
    process.env.BRAINET_RUN_JSON_FILENAME || 'runJson';
  process.env.BRAINET_CPP_FILENAME =
    process.env.BRAINET_CPP_FILENAME || 'run_json.cpp';
  process.env.BRAINET_TASK_JSON_FILENAME =
    process.env.BRAINET_TASK_JSON_FILENAME || 'task.json';
  process.env.CPP_VERSION = process.env.CPP_VERSION || 'c++20';
  process.env.MAX_TRAINING_QUEUE_LENGTH =
    process.env.MAX_TRAINING_QUEUE_LENGTH || '30';
  process.env.START_TRAINING_WORKER_AS_SERVER =
    process.env.START_TRAINING_WORKER_AS_SERVER === 'true' ? 'true' : '';
};
