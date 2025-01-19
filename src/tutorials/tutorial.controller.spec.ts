import { TutorialsController } from './tutorials.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserModel } from '../../mongooseSchemas/user.schema';
import { TutorialModel } from '../../mongooseSchemas/tutorial.schema';
import { UserDocument } from '../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import * as dotenv from 'dotenv';
import { tutorialScript } from '../../scripts/createTutorials';
import { ProjectModel } from '../../mongooseSchemas/project.schema';

dotenv.config();

describe('TutorialsController', () => {
  let tutorialsController: TutorialsController;
  let mongoServer: MongoMemoryServer;
  let user: UserDocument;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    user = new UserModel({
      emails: [
        {
          emailType: 'primary',
          address: 'chisato@lycoris.jp',
          verified: true,
          dateAdded: new Date(),
        },
      ],
      brainetTag: 'chisato',
      passwordHash: 'hashedPassword',
      dateAdded: new Date(),
    });
    await user.save();

    // Call the tutorialScript function
    await tutorialScript();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    tutorialsController = new TutorialsController();
  });

  afterEach(async () => {
    await ProjectModel.deleteMany({});
  });

  describe('get', () => {
    it('should return a tutorial by id', async () => {
      const tutorial = await TutorialModel.findOne({});
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }
      const result = await tutorialsController.get(tutorial._id, user);
      expect(result).toHaveProperty('tutorial');
      const tutorialData = result.tutorial;
      expect(tutorialData).toHaveProperty('_id');
      expect(tutorialData).toHaveProperty('name');
      expect(tutorialData).toHaveProperty('summary');
      const tutorialId = tutorialData._id;
      expect(tutorialId).toEqual(tutorial._id);
    });

    it('should throw an error if tutorial not found', async () => {
      const invalidId = new Types.ObjectId();
      await expect(tutorialsController.get(invalidId, user)).rejects.toThrow(
        'Tutorial not found'
      );
    });
  });

  describe('getByName', () => {
    it('should return a tutorial by name', async () => {
      const tutorial = await TutorialModel.findOne({});
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }
      const result = await tutorialsController.getByName(tutorial.name, user);
      expect(result).toHaveProperty('tutorial');
      const tutorialData = result.tutorial;
      expect(tutorialData).toHaveProperty('_id');
      expect(tutorialData).toHaveProperty('name');
      expect(tutorialData.name).toEqual(tutorial.name);
    });

    it('should throw an error if tutorial not found', async () => {
      await expect(
        tutorialsController.getByName('nonexistent', user)
      ).rejects.toThrow('Tutorial not found');
    });
  });

  describe('setState', () => {
    it('should update the state of a tutorial', async () => {
      const tutorial = await TutorialModel.findOne({});
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }
      const setStateDto = { setStep: 1, setCompleted: true };
      const result = await tutorialsController.setState(
        tutorial._id,
        setStateDto,
        user
      );
      expect(result).toHaveProperty('msg', 'Tutorial state updated');
      expect(result).toHaveProperty('projectId');
      const projectId = result.projectId;
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      expect(project.tutorialStep).toEqual(1);
      expect(user.completedTutorials).toContainEqual(tutorial._id);
    });

    it('should throw an error if tutorial not found', async () => {
      const invalidId = new Types.ObjectId();
      const setStateDto = { setStep: 1, setCompleted: true };
      await expect(
        tutorialsController.setState(invalidId, setStateDto, user)
      ).rejects.toThrow('Tutorial not found');
    });

    it('should create a new project if it does not exist', async () => {
      const tutorial = await TutorialModel.findOne({});
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }
      const setStateDto = { setStep: 1, setCompleted: false };
      const result = await tutorialsController.setState(
        tutorial._id,
        setStateDto,
        user
      );
      expect(result).toHaveProperty('msg', 'Tutorial state updated');
      expect(result).toHaveProperty('projectId');
      const projectId = result.projectId;
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      expect(project.tutorialStep).toEqual(1);
      expect(project.isTutorialProject).toBe(true);
      expect(project.tutorialId).toEqual(tutorial._id);
    });

    it('should update the existing project if it exists', async () => {
      const tutorial = await TutorialModel.findOne({});
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }
      const project = new ProjectModel({
        name: tutorial.name,
        description: tutorial.description,
        ownerId: user._id,
        visibility: 'private',
        isTutorialProject: true,
        tutorialId: tutorial._id,
        tutorialStep: 0,
      });
      await project.save();

      const setStateDto = { setStep: 2, setCompleted: false };
      const result = await tutorialsController.setState(
        tutorial._id,
        setStateDto,
        user
      );
      expect(result).toHaveProperty('msg', 'Tutorial state updated');
      expect(result).toHaveProperty('projectId');
      const projectId = result.projectId;
      const updatedProject = await ProjectModel.findById(projectId);
      if (!updatedProject) {
        throw new Error('Project not found');
      }
      expect(updatedProject.tutorialStep).toEqual(2);
    });
  });
});
