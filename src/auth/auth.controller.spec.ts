import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppLogger } from '../../providers/logger.provider';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    process.env.BACKMIND_HOSTNAME = 'http://localhost:3000';
    process.env.JWT_SECRET = 'animeIsGoodForYourHealth';
    process.env.JWT_TOKEN_EXPIRE_IN = '24h';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    authService = new AuthService(new JwtService());
    authController = new AuthController(new AppLogger(), authService);
  });

  describe('register', () => {
    it('should return a jwt token', async () => {
      const requestBody = {
        user: {
          email: 'nishigiki@chisato.jp',
          brainetTag: 'chisato',
          plainPassword: 'qwertyqwerty12345678!',
        },
        agreedToTermsOfServiceAndPrivacyPolicy: true,
      };
      const result = await authController.register(requestBody);

      expect(result).toHaveProperty('access_token');
    });
  });
});
