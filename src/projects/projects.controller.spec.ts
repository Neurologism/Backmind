import { ProjectsController } from './projects.controller';
import { CreateDto } from './dto/create.schema';
import { UpdateDto } from './dto/update.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserModel } from '../../mongooseSchemas/user.schema';
import { ProjectModel } from '../../mongooseSchemas/project.schema';
import { UserDocument } from '../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { TaskModel } from '../../mongooseSchemas/task.schema';

describe('ProjectsController', () => {
  let projectsController: ProjectsController;
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
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    projectsController = new ProjectsController();
  });

  afterEach(async () => {
    await ProjectModel.deleteMany({});
  });

  describe('isTaken', () => {
    it('should return whether the project name is taken', async () => {
      const projectName = 'testProject';
      const result = await projectsController.isTaken(projectName, user);
      expect(result).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createDto: CreateDto = {
        project: {
          name: 'newProject',
          description: 'A new project',
          visibility: 'private',
        },
      };
      const result = await projectsController.create(createDto, user);
      expect(result).toHaveProperty('project');
    });
  });

  describe('get', () => {
    it('should return a project by id with populated tasks excluding components and output', async () => {
      const task = new TaskModel({
        status: 'queued',
        output: ['output1', 'output2'],
        components: { some: 'task' },
        projectId: new Types.ObjectId(),
        ownerId: user._id,
      });
      await task.save();

      const project = new ProjectModel({
        name: 'existingProject',
        description: 'An existing project',
        ownerId: user._id,
        visibility: 'private',
        tasks: [task._id],
      });
      await project.save();

      const result = await projectsController.get(project._id, user);
      const project2 = result.project;
      expect(project2).toHaveProperty('name', 'existingProject');
      expect(project2).toHaveProperty('description', 'An existing project');
      expect(project2).toHaveProperty('ownerId', user._id);
      expect(project2).toHaveProperty('visibility', 'private');
      expect(project2.tasks).toHaveLength(1);
      expect(project2.tasks[0]).toHaveProperty('status', 'queued');
      expect(project2.tasks[0]).toHaveProperty('components', undefined);
      expect(project2.tasks[0]).toHaveProperty('output', undefined);
    });

    it('should throw an error for an invalid project id', async () => {
      const invalidId = new Types.ObjectId();
      await expect(projectsController.get(invalidId, user)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a project by id', async () => {
      const project = new ProjectModel({
        name: 'projectToDelete',
        description: 'A project to delete',
        ownerId: user._id,
        visibility: 'private',
      });
      await project.save();

      const result = await projectsController.delete(project._id, user);
      expect(result).toEqual({ msg: 'Project deleted successfully.' });

      const deletedProject = await ProjectModel.findById(project._id);
      expect(deletedProject).toBeNull();
    });

    it('should throw an error for an invalid project id', async () => {
      const invalidId = new Types.ObjectId();
      await expect(
        projectsController.delete(invalidId, user)
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a project by id', async () => {
      const project = new ProjectModel({
        name: 'projectToUpdate',
        description: 'A project to update',
        ownerId: user._id,
        visibility: 'private',
      });
      await project.save();

      const updateDto: UpdateDto = {
        project: {
          name: 'updatedProject',
          description: 'An updated project',
          _id: project._id,
        },
      };

      const result = await projectsController.update(
        project._id,
        updateDto,
        user
      );
      expect(result).toHaveProperty('msg', 'Project changed successfully.');
    });
  });
});
