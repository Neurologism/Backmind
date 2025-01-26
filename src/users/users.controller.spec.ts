// src/users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AppLogger } from '../../providers/logger.provider';
import { UserDocument, UserModel } from '../../mongooseSchemas/user.schema';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Readable } from 'node:stream';

describe('UsersController', () => {
  let usersController: UsersController;
  let mongoServer: MongoMemoryServer;
  let user: UserDocument;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [AppLogger],
    }).compile();

    usersController = module.get<UsersController>(UsersController);

    process.env.BACKMIND_HOSTNAME = 'http://localhost:3000';
    process.env.PFP_DIRECTORY = path.resolve(
      __dirname,
      '../../dataStorage/pfp'
    );
    process.env.PFP_SAVE_SIZE = '512';
    process.env.DISCORD_LOGGING = 'false';
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    user = new UserModel({
      emails: [
        {
          emailType: 'primary',
          address: 'chisato@lycoris.jp',
          verified: true,
          dateAdded: new Date(),
        },
        {
          emailType: 'secondary',
          address: 'chisato@whitemind.net',
          verified: true,
          dateAdded: new Date(),
        },
      ],
      brainetTag: 'chisato',
      passwordHash: 'hashedPassword',
      dateAdded: new Date(),
    });
    user = await user.save(); // Ensure the user is saved and the returned document is used
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      const result = await usersController.getById(user._id, user);
      expect(result).toHaveProperty('user');
      const userResult = result.user;
      expect(userResult).toHaveProperty('_id', user._id);
      expect(userResult).toHaveProperty('brainetTag', 'chisato');
    });

    it('should throw an error if user not found', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      await expect(usersController.getById(invalidId, user)).rejects.toThrow(
        'No user found matching the criteria.'
      );
    });
  });

  describe('getByName', () => {
    it('should return a user by brainetTag', async () => {
      const result = await usersController.getByName('chisato');
      expect(result).toHaveProperty('user');
      const userResult = result.user;
      expect(userResult).toHaveProperty('_id', user._id);
      expect(userResult).toHaveProperty('brainetTag', 'chisato');
    });

    it('should throw an error if user not found', async () => {
      await expect(usersController.getByName('nonexistent')).rejects.toThrow(
        'No user found matching the criteria.'
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = await usersController.delete(user);
      expect(result).toHaveProperty('msg', 'User deleted');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { user: { brainetTag: 'chisato-updated' } };
      const result = await usersController.update(updateDto, user);
      expect(result).toHaveProperty('msg', 'User updated successfully.');
      const updatedUser = await UserModel.findById(user._id);
      expect(updatedUser).toHaveProperty('brainetTag', 'chisato-updated');
    });
  });

  describe('getCredits', () => {
    it('should return user credits', async () => {
      const result = await usersController.getCredits(user);
      expect(result).toHaveProperty('remainingCredits', 600);
    });
  });

  describe('swapPrimaryEmail', () => {
    it('should swap primary email', async () => {
      const result = await usersController.swapPrimaryEmail(user);
      expect(result).toHaveProperty(
        'msg',
        'Primary email swapped successfully'
      );
    });

    it('should throw an error if user does not have a secondary email', async () => {
      const invalidUser = new UserModel({
        emails: [
          {
            emailType: 'primary',
            address: 'invalid@lycoris.jp',
            verified: true,
            dateAdded: new Date(),
          },
        ],
        brainetTag: 'invalid',
        passwordHash: 'hashedPassword',
        dateAdded: new Date(),
      });
      await expect(
        usersController.swapPrimaryEmail(invalidUser)
      ).rejects.toThrow('User does not have a primary or secondary email');
    });
  });

  describe('follow', () => {
    let anotherUser: UserDocument;

    beforeEach(async () => {
      anotherUser = new UserModel({
        emails: [
          {
            emailType: 'primary',
            address: 'takina@lycoris.jp',
            verified: true,
            dateAdded: new Date(),
          },
        ],
        brainetTag: 'takina',
        passwordHash: 'hashedPassword',
        dateAdded: new Date(),
      });
      anotherUser = await anotherUser.save();
    });

    it('should follow another user', async () => {
      const result = await usersController.follow(anotherUser._id, user);
      expect(result).toHaveProperty('msg', 'User followed successfully');
    });

    it('should throw an error if user not found', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      await expect(usersController.follow(invalidId, user)).rejects.toThrow(
        'User to follow not found'
      );
    });

    it('should throw an error if trying to follow yourself', async () => {
      await expect(usersController.follow(user._id, user)).rejects.toThrow(
        'You cannot follow yourself'
      );
    });
  });

  describe('unfollow', () => {
    let anotherUser: UserDocument;

    beforeEach(async () => {
      anotherUser = new UserModel({
        emails: [
          {
            emailType: 'primary',
            address: 'takina@lycoris.jp',
            verified: true,
            dateAdded: new Date(),
          },
        ],
        brainetTag: 'takina',
        passwordHash: 'hashedPassword',
        dateAdded: new Date(),
      });
      anotherUser = await anotherUser.save();
      await usersController.follow(anotherUser._id, user);
    });

    it('should unfollow another user', async () => {
      const result = await usersController.unfollow(anotherUser._id, user);
      expect(result).toHaveProperty('msg', 'User unfollowed successfully');
    });

    it('should throw an error if user not found', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      await expect(usersController.unfollow(invalidId, user)).rejects.toThrow(
        'User to unfollow not found'
      );
    });
  });

  describe('deleteEmail', () => {
    it('should delete an email', async () => {
      const result = await usersController.deleteEmail('primary', user);
      expect(result).toHaveProperty('msg', 'Email deleted successfully');
    });
  });

  describe('updateEmailHandler', () => {
    it('should update an email', async () => {
      const updateEmailDto = {
        user: { emailType: 'secondary', email: 'chisato2@lycoris.jp' },
      };
      const result = await usersController.updateEmailHandler(
        updateEmailDto,
        user
      );
      expect(result).toHaveProperty('msg', 'Email updated successfully');
    });

    it('should throw an error if trying to update verified primary', async () => {
      const invalidUser = new UserModel({
        emails: [
          {
            emailType: 'primary',
            address: 'invalid@lycoris.jp',
            verified: true,
            dateAdded: new Date(),
          },
        ],
        brainetTag: 'invalid',
        passwordHash: 'hashedPassword',
        dateAdded: new Date(),
      });
      const updateEmailDto = {
        user: { emailType: 'primary', email: 'invalid@lycoris.jp' },
      };
      await expect(
        usersController.updateEmailHandler(updateEmailDto, invalidUser)
      ).rejects.toThrow('A verified primary email cannot be updated');
    });
  });

  describe('isTaken', () => {
    it('should return that user with brainetTag is taken', async () => {
      const result = await usersController.isTaken('chisato', '');
      expect(result).toHaveProperty('isTaken', true);
    });

    it('should return that user with email is taken', async () => {
      const result = await usersController.isTaken('', 'chisato@lycoris.jp');
      expect(result).toHaveProperty('isTaken', true);
    });

    it('should return that user with brainetTag is not taken', async () => {
      const result = await usersController.isTaken('nonexistent', '');
      expect(result).toHaveProperty('isTaken', false);
    });

    it('should return that user with email is not taken', async () => {
      const result = await usersController.isTaken(
        '',
        'nonexistent@lycoris.jp'
      );
      expect(result).toHaveProperty('isTaken', false);
    });
  });

  describe('uploadPfp', () => {
    it('should upload a profile picture', async () => {
      const filePath = path.resolve(__dirname, './test.png');
      const fileBuffer = fs.readFileSync(filePath);
      const fileStream = fs.createReadStream(filePath);
      const file: Express.Multer.File = {
        fieldname: 'pfp',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: fileBuffer.length,
        stream: fileStream,
        destination: '',
        filename: 'test.png',
        path: filePath,
        buffer: fileBuffer,
      };

      const result = await usersController.uploadPfp(
        user._id,
        { pfp: [file] },
        user
      );
      expect(result).toHaveProperty('msg', 'Profile picture uploaded');
    });
  });

  describe('getPfp', () => {
    it('should return a profile picture', async () => {
      const filePath = path.resolve(__dirname, './test.png');
      const fileBuffer = fs.readFileSync(filePath);
      const fileStream = fs.createReadStream(filePath);
      const file: Express.Multer.File = {
        fieldname: 'pfp',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: fileBuffer.length,
        stream: fileStream,
        destination: '',
        filename: 'test.png',
        path: filePath,
        buffer: fileBuffer,
      };

      await usersController.uploadPfp(user._id, { pfp: [file] }, user);

      const result = await usersController.getPfp(user._id);

      async function streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', reject);
        });
      }

      const image = sharp(await streamToBuffer(result.getStream()));
      const metadata = await image.metadata();
      expect(metadata).toHaveProperty('format', 'png');
    });

    it('should throw an error if user has no profile picture', async () => {
      const invalidId = new mongoose.Types.ObjectId();
      await expect(usersController.getPfp(invalidId)).rejects.toThrow(
        'There is no profile picture for this user.'
      );
    });
  });
});
