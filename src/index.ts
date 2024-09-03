import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { MongoClient } from 'mongodb';

dotenv.config();

const app: Express = express();
const express_port = process.env.EXPRESS_PORT || 3000;

const mongo_url = process.env.MONGO_URL || "127.0.0.1"
const mongo_port = process.env.MONGO_PORT || "27017"
const mongo_user = process.env.MONGO_USER || "admin"
const mongo_pass = process.env.MONGO_PASS || "123"
const mongo_uri = `mongodb://${mongo_user}:${mongo_pass}@${mongo_url}:${mongo_port}`;
const dbclient = new MongoClient(mongo_uri);
const db_name = process.env.DB_NAME || "backmind"

async function init_mongo() {
  await dbclient.connect();
  console.log("Connected to database server. ")
  const db = dbclient.db(db_name)
  const collection = db.collection('documents');
  if (process.env.RESET_DB == "true") {
    console.log("Resetting database... ")
    await db.dropDatabase();
    const collections = ['users', 'projects'];
    for (const collectionName of collections) {
      await db.createCollection(collectionName);
    }
    console.log("Database reset successful")
  }
}

app.get("/", (req: Request, res: Response) => {
  res.send("Backbrain Express Server");
});

init_mongo()
  .then(() => app.listen(express_port, () => {
    console.log(`express server is running at http://localhost:${express_port}`);
  })
);

