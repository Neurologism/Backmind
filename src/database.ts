import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db;

export const connectToDatabase = async (): Promise<Db> => {
  if (db) {
    return db;
  }
  const client = new MongoClient(process.env.MONGO_URI as string);
  await client.connect();
  db = client.db(process.env.DB_NAME || 'backmind');

  if (process.env.RESET_DB == 'true') {
    console.log('Resetting database... ');
    await db.dropDatabase();
    const collections = ['users', 'projects'];
    for (const collectionName of collections) {
      await db.createCollection(collectionName);
    }
    console.log('Database reset successful');
  }

  console.log(`Connected to database: ${process.env.DB_NAME}`);
  return db;
};
