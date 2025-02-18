import { TasksController } from './tasks.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserModel } from '../../mongooseSchemas/user.schema';
import { TaskModel } from '../../mongooseSchemas/task.schema';
import { UserDocument } from '../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { TrainingStartDto } from './dto/trainingStart.schema';
import { ProjectModel } from '../../mongooseSchemas/project.schema';
import { UpdateTaskDto } from './dto/updateTask.schema';

describe('TasksController', () => {
  let tasksController: TasksController;
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
          dateAdded: {
            $date: new Date(),
          },
        },
      ],
      brainetTag: 'chisato',
      passwordHash: 'hashedPassword',
      dateAdded: {
        $date: new Date(),
      },
    });
    await user.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    tasksController = new TasksController();
  });

  afterEach(async () => {
    await TaskModel.deleteMany({});
    await ProjectModel.deleteMany({});
  });

  describe('trainingStart', () => {
    it('should start a training task', async () => {
      const project = new ProjectModel({
        name: 'testProject',
        ownerId: user._id,
        visibility: 'private',
      });
      await project.save();

      const trainingStartDto: TrainingStartDto = {
        project: {
          _id: project._id,
        },
      };
      const result = await tasksController.trainingStart(
        trainingStartDto,
        user
      );
      expect(result).toHaveProperty('task');
    });
  });

  describe('trainingStatus', () => {
    it('should return the status of a training task by id', async () => {
      const project = new ProjectModel({
        name: 'testProject',
        ownerId: user._id,
        visibility: 'private',
      });
      await project.save();

      const task = new TaskModel({
        name: 'existingTask',
        description: 'An existing task',
        ownerId: user._id,
        projectId: project._id,
        status: 'queued',
        components: project.components,
      });
      await task.save();

      const result = await tasksController.trainingStatus(task._id, user);
      expect(result).toHaveProperty('task');
      const taskStatus = result.task.status;
      expect(taskStatus).toBe('queued');
    });

    it('should throw an error for an invalid task id', async () => {
      const invalidId = new Types.ObjectId();
      await expect(
        tasksController.trainingStatus(invalidId, user)
      ).rejects.toThrow();
    });
  });

  describe('trainingStop', () => {
    it('should stop a training task by id', async () => {
      const project = new ProjectModel({
        name: 'testProject',
        ownerId: user._id,
        visibility: 'private',
      });
      await project.save();

      const task = new TaskModel({
        name: 'taskToStop',
        description: 'A task to stop',
        ownerId: user._id,
        projectId: project._id,
        status: 'queued',
        components: project.components,
      });
      await task.save();

      const result = await tasksController.trainingStop(task._id, user);
      expect(result).toHaveProperty('msg', 'Task training stopped.');
      const stoppedTask = await TaskModel.findById(task._id);
      const taskStatus = stoppedTask?.status;
      expect(taskStatus).toBe('stopped');
    });

    it('should throw an error for an invalid task id', async () => {
      const invalidId = new Types.ObjectId();
      await expect(
        tasksController.trainingStop(invalidId, user)
      ).rejects.toThrow();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by id', async () => {
      const project = new ProjectModel({
        name: 'testProject',
        ownerId: user._id,
        visibility: 'private',
      });
      await project.save();

      const task = new TaskModel({
        name: 'taskToDelete',
        description: 'A task to delete',
        ownerId: user._id,
        projectId: project._id,
        status: 'queued',
        components: project.components,
      });
      await task.save();

      const result = await tasksController.deleteTask(task._id, user);
      expect(result).toEqual({ msg: 'Task deleted successfully.' });

      const deletedTask = await TaskModel.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should throw an error for an invalid task id', async () => {
      const invalidId = new Types.ObjectId();
      await expect(
        tasksController.deleteTask(invalidId, user)
      ).rejects.toThrow();
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const project = new ProjectModel({
        name: 'testProject',
        ownerId: user._id,
        visibility: 'private',
      });
      await project.save();

      const task = new TaskModel({
        name: 'taskToUpdate',
        description: 'A task to update',
        ownerId: user._id,
        projectId: project._id,
        status: 'queued',
        components: project.components,
      });
      await task.save();

      const updateTaskDto: UpdateTaskDto = {
        task: {
          _id: task._id,
          name: 'updatedTaskName',
        },
      };

      const result = await tasksController.updateTask(updateTaskDto, user);
      expect(result).toEqual({ msg: 'Task updated successfully.' });

      const updatedTask = await TaskModel.findById(task._id);
      expect(updatedTask?.name).toBe('updatedTaskName');
    });

    it('should throw an error if the task does not exist', async () => {
      const updateTaskDto: UpdateTaskDto = {
        task: {
          _id: new Types.ObjectId(),
          name: 'nonExistentTask',
        },
      };

      await expect(
        tasksController.updateTask(updateTaskDto, user)
      ).rejects.toThrow('Task with that id does not exist.');
    });

    it('should throw an error if the project does not exist', async () => {
      const task = new TaskModel({
        name: 'taskWithNonExistentProject',
        description: 'A task with a non-existent project',
        ownerId: user._id,
        projectId: new Types.ObjectId(),
        status: 'queued',
        components: [],
      });
      await task.save();

      const updateTaskDto: UpdateTaskDto = {
        task: {
          _id: task._id,
          name: 'updatedTaskName',
        },
      };

      await expect(
        tasksController.updateTask(updateTaskDto, user)
      ).rejects.toThrow('Project with that id does not exist.');
    });

    it('should throw an error if the user is not authorized', async () => {
      const project = new ProjectModel({
        name: 'testProject',
        ownerId: new Types.ObjectId(),
        visibility: 'private',
      });
      await project.save();

      const task = new TaskModel({
        name: 'taskToUpdate',
        description: 'A task to update',
        ownerId: user._id,
        projectId: project._id,
        status: 'queued',
        components: project.components,
      });
      await task.save();

      const updateTaskDto: UpdateTaskDto = {
        task: {
          _id: task._id,
          name: 'updatedTaskName',
        },
      };

      await expect(
        tasksController.updateTask(updateTaskDto, user)
      ).rejects.toThrow('Not authorized.');
    });
  });
});
