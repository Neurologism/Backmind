import { z } from 'zod';
import request from 'supertest';
import { setEnv } from '../env';
import fs from 'fs';

setEnv('.env.test');
setEnv();

import app from '../app';
import { disconnectFromDatabase } from '../utility/connectToDatabase';

import apiAuthLogin from './main_tests/apiAuthLogin';
import apiAuthRegister from './main_tests/apiAuthRegister';
import apiProjectCreate from './main_tests/apiProjectCreate';
import apiProjectGet from './main_tests/apiProjectGet';
import apiProjectIsTaken from './main_tests/apiProjectIsTaken';
import apiProjectModelTrainingStart from './main_tests/apiProjectModelTrainingStart';
import apiProjectModelTrainingStatus from './main_tests/apiProjectModelTrainingStatus';
import apiProjectModelTrainingStop from './main_tests/apiProjectModelTrainingStop';
import apiProjectUpdate from './main_tests/apiProjectUpdate';
import apiUserGet from './main_tests/apiUserGet';
import apiUserIsTaken from './main_tests/apiUserIsTaken';
import apiUserUpdate from './main_tests/apiUserUpdate';

const vars = {};

afterAll(async () => {
  await disconnectFromDatabase();
});

describe('POST /api/auth/register', () => {
  apiAuthRegister(app);
});

describe('POST /api/auth/login', () => {
  apiAuthLogin(app, vars);
});

describe('POST /api/user/is-taken', () => {
  apiUserIsTaken(app);
});

describe('POST /api/user/get', () => {
  apiUserGet(app, vars);
});

describe('POST /api/user/update', () => {
  apiUserUpdate(app, vars);
});

describe('POST /api/project/create', () => {
  apiProjectCreate(app, vars);
});

describe('POST /api/project/is-taken', () => {
  apiProjectIsTaken(app, vars);
});

describe('POST /api/project/get', () => {
  apiProjectGet(app, vars);
});

describe('POST /api/project/update', () => {
  apiProjectUpdate(app, vars);
});

// describe('POST /api/project/model/training-start', () => {
//   apiProjectModelTrainingStart(app, vars);
// });

// describe('POST /api/project/model/training-status', () => {
//   apiProjectModelTrainingStatus(app, vars);
// });

// describe('POST /api/project/model/training-stop', () => {
//   apiProjectModelTrainingStop(app, vars);
// });
