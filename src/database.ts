import { MongoClient, Db } from 'mongodb';

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

  if (process.env.RESET_DB) {
    console.log('Resetting database... ');
    await db.dropDatabase();
    const collections = ['users', 'projects'];
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
