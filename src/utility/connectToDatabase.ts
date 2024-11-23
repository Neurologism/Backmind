import mongoose from 'mongoose';
import { ProjectModel } from '../mongooseSchemas/projectSchema';
import { QueueItemModel } from '../mongooseSchemas/queueItemSchema';
import { TaskModel } from '../mongooseSchemas/taskSchema';
import { UserModel } from '../mongooseSchemas/userSchema';

export const connectToDatabase = async () => {
  console.log('Trying to connect to the database...');
  mongoose.connect(process.env.MONGO_URI as string);

  if (process.env.RESET_DB === 'true') {
    console.log('Resetting database... ');
    ProjectModel.deleteMany({});
    QueueItemModel.deleteMany({});
    TaskModel.deleteMany({});
    UserModel.deleteMany({});
    console.log('Database reset successful');
  }

  console.log(`Connected to database: ${process.env.DB_NAME}`);
};
