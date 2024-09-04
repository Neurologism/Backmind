import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from 'body-parser'
import dotenv from "dotenv";
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


dotenv.config();

const app: Express = express();
const express_port = process.env.EXPRESS_PORT || 3000;
app.use(bodyParser.json())

const saltRounds = process.env.SALT_ROUNDS || 10;

const jwtSecret = 'some-random-secret' // TODO: change it to more secure secret in production

const mongoUrl = process.env.MONGO_URL || "127.0.0.1"
const mongoPort = process.env.MONGO_PORT || "27017"
const mongoUser = process.env.MONGO_USER || "admin"
const mongoPass = process.env.MONGO_PASS || "123"
const mongoUri = `mongodb://${mongoUser}:${mongoPass}@${mongoUrl}:${mongoPort}`;
const dbClient = new MongoClient(mongoUri);
const dbName = process.env.DB_NAME || "backmind"

const db = dbClient.db(dbName);


enum Visibility {
  Private = "private",
  Public = "public"
}

type Block = Object // TODO

type Variable = Object // TODO

type User = {
  _id?: ObjectId,
  email?: string,
  about_you?: string,
  displayname?: string,
  brainet_tag?: string,
  password_hash?: string,
  date_of_birth?: number,
  visibility?: Visibility,
  created_on?: number,
  project_ids?: number[],
  follower_ids?: number[],
  following_ids?: number[]
}

type UserExplicit = Required<User>;

type UserLogin = User & {
  email: string,
  plain_password: string
}

type Project = {
  _id?: ObjectId,
  name?: string,
  description?: string,
  owner_id?: number,
  contributors?: number[],
  visibility?: Visibility,
  created_on?: number,
  last_edited?: number,
  blocks?: Block[],
  variables?: Variable[]
}

type ProjectExplicit = Required<Project>;


async function initMongo() {
  await dbClient.connect();
  console.log("Connected to database server. ")
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

async function getUser(user_search_data: User) {
  const users = db.collection("users")
  const user = users.findOne(user_search_data) as unknown as UserExplicit | null
  return user
}

async function searchUsers(user_search_data: User) {
  const users = db.collection("users")
  return users.find(user_search_data)
}

async function create_user(new_user: User) {
  const users = db.collection("users")
  return users.insertOne(new_user)
}

async function deleteUser(target_user: User) {
  const users = db.collection("users")
  users.deleteOne(target_user)
}

async function updateUser(target_user: User, edit_properties: User) {
  const users = db.collection("users")
  users.updateOne(target_user, { $set: edit_properties })
}

async function getProject(project_search_data: Project) {
  const projects = db.collection("projects")
  return projects.findOne(project_search_data)
}

async function searchProjects(project_search_data: Project) {
  const projects = db.collection("projects")
  return projects.find(project_search_data)
}

async function createProject(new_project: Project) {
  const projects = db.collection("projects")
  return projects.insertOne(new_project)
}

async function deleteProject(target_project: Project) {
  const projects = db.collection("projects")
  projects.deleteOne(target_project)
}

async function updateProject(target_project: Project, edit_properties: Project) {
  const projects = db.collection("projects")
  projects.updateOne(target_project, { $set: edit_properties })
}


app.get("/", async (req: Request, res: Response) => {
  res.send("Backbrain Express Server");
  return
});

app.post("/api/user/login", async (req: Request, res: Response) => {});

app.post("/api/user/logout", async (req: Request, res: Response) => {});

app.post("/api/user/register", async (req: Request, res: Response) => {});

app.post("/api/user/search", async (req: Request, res: Response) => {});

app.post("/api/user/get", async (req: Request, res: Response) => {});

app.post("/api/user/update", async (req: Request, res: Response) => {});

app.post("/api/user/delete", async (req: Request, res: Response) => {});

app.post("/api/user/follow", async (req: Request, res: Response) => {});

app.post("/api/user/unfollow", async (req: Request, res: Response) => {});

app.post("/api/project/get", async (req: Request, res: Response) => {});

app.post("/api/project/search", async (req: Request, res: Response) => {});

app.post("/api/project/update", async (req: Request, res: Response) => {});

app.post("/api/project/create", async (req: Request, res: Response) => {});

app.post("/api/project/delete", async (req: Request, res: Response) => {});

app.post("/api/project/training/start", async (req: Request, res: Response) => {});

app.post("/api/project/training/stop", async (req: Request, res: Response) => {});

app.post("/api/project/training/get", async (req: Request, res: Response) => {});

app.post("/api/project/model/query", async (req: Request, res: Response) => {});

app.post("/api/project/model/download", async (req: Request, res: Response) => {});

initMongo()
  .then(() => app.listen(express_port, () => {
    console.log(`express server is running at http://localhost:${express_port}`);
  })
);

