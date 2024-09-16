import { MongoClient, Db } from 'mongodb';
import { arraysEqual } from './arraysEqual';

const collections = ['users', 'projects', 'training_queue', 'models'];
let connected = false;
let db: Db;
let client: MongoClient;

export const connectToDatabase = async (): Promise<Db> => {
  if (connected) {
    return db;
  }
  client = new MongoClient(process.env.MONGO_URI as string);
  await client.connect();
  db = client.db(process.env.DB_NAME);

  let resetDb = process.env.RESET_DB === 'true';
  if (!arraysEqual(await db.listCollections().toArray(), collections)) {
    console.log('Resetting databse due to missing collections...');
    resetDb = true;
  }
  if (resetDb) {
    console.log('Resetting database... ');
    await db.dropDatabase();
    for (const collectionName of collections) {
      await db.createCollection(collectionName);
    }
    console.log('Database reset successful');
  }

  console.log(`Connected to database: ${process.env.DB_NAME}`);
  connected = true;
  return db;
};

export const disconnectFromDatabase = async () => {
  await client.close();
  connected = false;
};
