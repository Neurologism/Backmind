import { setEnv } from './src/env';
import fs from 'fs';

setEnv();

try {
  fs.mkdirSync('./logs');
} catch (err: any) {
  if (err.code !== 'EEXIST') throw err;
}

process.env.DB_NAME = 'backmind-test';
process.env.RESET_DB = 'false';

declare global {
  var authToken: string;
  var projectId: string;
}
