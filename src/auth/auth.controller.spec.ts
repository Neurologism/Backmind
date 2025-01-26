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
    process.env.JWT_SECRET = 'animeIsNOTGoodForYourHealth';
    process.env.JWT_TOKEN_EXPIRE_IN = '24h';
    process.env.VERIFY_ALL_EMAILS = 'true';
    process.env.DISCORD_LOGGING = 'false';
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

  afterEach(async () => {
    await UserModel.deleteMany({});
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

  describe('logoutAll', () => {
    it('should log out all sessions for the user', async () => {
      const user = new UserModel({
        emails: [
          {
            emailType: 'primary',
            address: 'chisato@lycoris.jp',
            verified: true,
            dateAdded: new Date(),
          },
        ],
        brainetTag: 'chisato',
        passwordHash: await bcrypt.hash('qwertyqwerty12345678!', 10),
        dateAdded: new Date(),
        tokens: [{ token: 'someToken' }, { token: 'anotherToken' }],
      });
      await user.save();

      const result = await authController.logoutAll(user);

      expect(result).toEqual({
        msg: 'Logged out from all devices successfully',
      });

      const updatedUser = await UserModel.findById(user._id);
      if (!updatedUser) {
        throw new Error('User not found');
      }
      expect(updatedUser.tokens.length).toBe(0);
    });
  });

  describe('logout', () => {
    it('should log out a specific session for the user', async () => {
      const token = 'someToken';
      const user = new UserModel({
        emails: [
          {
            emailType: 'primary',
            address: 'chisato@lycoris.jp',
            verified: true,
            dateAdded: new Date(),
          },
        ],
        brainetTag: 'chisato',
        passwordHash: await bcrypt.hash('qwertyqwerty12345678!', 10),
        dateAdded: new Date(),
        tokens: [{ token }, { token: 'anotherToken' }],
      });
      await user.save();

      const result = await authController.logout(token, user);

      expect(result).toEqual({ msg: 'Logged out successfully' });

      const updatedUser = await UserModel.findById(user._id);
      if (!updatedUser) {
        throw new Error('User not found');
      }
      expect(updatedUser.tokens.some((t) => t.token === token)).toBe(false);
      expect(updatedUser.tokens.length).toBe(1);
    });
  });

  describe('verifyEmail', () => {
    it("should verify the user's email", async () => {
      const email = 'chisato@lycoris.jp';
      const verificationToken = 'verificationToken';

      const user = new UserModel({
        emails: [
          {
            emailType: 'primary',
            address: email,
            verified: false,
            dateAdded: new Date(),
            verificationToken: verificationToken,
            dateVerificationSent: new Date(),
          },
        ],
        brainetTag: 'chisato',
        passwordHash: await bcrypt.hash('qwertyqwerty12345678!', 10),
        dateAdded: new Date(),
      });
      await user.save();

      const result = await authController.verifyEmail(verificationToken);

      expect(result).toHaveProperty('access_token');

      const updatedUser = await UserModel.findOne({
        'emails.verificationToken': verificationToken,
      });
      if (!updatedUser) {
        throw new Error('User not found');
      }
      expect(updatedUser.emails[0].verified).toBe(true);
    });
  });
});
