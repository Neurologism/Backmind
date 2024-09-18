import { connectToDatabase } from './connectToDatabase';
import { ObjectId } from 'mongodb';

export const projectNameExists = async (name: string, owner_id: ObjectId) => {
  const db = await connectToDatabase();
  const project = await db
    .collection('projects')
    .findOne({ name: name, owner_id: owner_id });
  return project !== null;
};
