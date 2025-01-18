import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AppLogger } from '../../providers/logger.provider';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserModel } from '../../mongooseSchemas/user.schema';
import bcrypt from 'bcrypt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mongoServer: MongoMemoryServer;
  let logger: AppLogger;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    process.env.BACKMIND_HOSTNAME = 'http://localhost:3000';
    process.env.JWT_SECRET = 'animeIsGoodForYourHealth';
    process.env.JWT_TOKEN_EXPIRE_IN = '24h';
    process.env.VERIFY_ALL_EMAILS = 'true';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    logger = new AppLogger();
    authService = new AuthService(new JwtService(), logger);
    authController = new AuthController(authService);
  });

  describe('register', () => {
    it('should return a jwt token', async () => {
      const requestBody = {
        user: {
          email: 'chisato@lycoris.jp',
          brainetTag: 'chisato',
          plainPassword: 'qwertyqwerty12345678!',
        },
        agreedToTermsOfServiceAndPrivacyPolicy: true,
      };
      const result = await authController.register(requestBody);

      expect(result).toHaveProperty('access_token');
    });
  });

  describe('login', () => {
    it('should return a jwt token', async () => {
      const email = 'kurumi@lycoris.jp';
      const brainetTag = 'kurumi';
      const plainPassword = 'qwerty';

      const userModel = new UserModel({
        emails: [
          {
            emailType: 'primary',
            address: email,
            verified: true,
            dateAdded: new Date(),
          },
        ],
        brainetTag,
        passwordHash: await bcrypt.hash(plainPassword, 10),
        dateAdded: new Date(),
      });
      await userModel.save();

      const result = await authController.login({
        user: {
          email,
          brainetTag,
          plainPassword,
        },
      });

      expect(result).toHaveProperty('access_token');
    });
  });
});
