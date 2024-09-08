import crypto from 'crypto';

process.env.EXPRESS_PORT = process.env.EXPRESS_PORT || '3000';
process.env.JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
process.env.SALT_ROUNDS = process.env.SALT_ROUNDS || '10';
process.env.MIN_PASS_LENGTH = process.env.MIN_PASS_LENGTH || '6';
process.env.MIN_BRAINET_TAG_LENGTH = process.env.MIN_BRAINET_TAG_LENGTH || '3';
process.env.MIN_PROJECT_NAME_LENGTH =
  process.env.MIN_PROJECT_NAME_LENGTH || '1';
process.env.SEND_ERR_TO_CLIENT = process.env.SEND_ERR_TO_CLIENT === 'true' ? 'true' : 'false';
