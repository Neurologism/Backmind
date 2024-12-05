import mongoose from 'mongoose';
import { ProjectModel } from '../mongooseSchemas/projectSchema';
import { QueueItemModel } from '../mongooseSchemas/queueItemSchema';
import { TaskModel } from '../mongooseSchemas/taskSchema';
import { UserModel } from '../mongooseSchemas/userSchema';

export const connectToDatabase = async () => {
  console.log('Trying to connect to the database');
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DB_NAME as string,
    });
  } catch (error: any) {
    console.log(`Error connecting to the database: ${error.name}`);
    process.exit(1);
  }

  if (process.env.RESET_DB === 'true') {
    console.log('Resetting database');
    await ProjectModel.deleteMany({});
    await QueueItemModel.deleteMany({});
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log('Database reset successful');
  }

  console.log(`Connected to database: ${process.env.DB_NAME}`);
};

export const disconnectFromDatabase = async () => {
  console.log('Disconnecting from database');
  await mongoose.disconnect();
};
