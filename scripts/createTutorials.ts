import mongoose from 'mongoose';
import fs from 'fs';
import { TutorialModel } from '../src/mongooseSchemas/tutorialSchema';
import { ProjectModel } from '../src/mongooseSchemas/projectSchema';

require('dotenv').config();

const ownerId = '67571ec746e58ba230e1d6d9';
const tutorials = ['intro/1.json', 'intro/2.json'];

async function createTutorial(tutorialPath: string) {
  const tutorialJson = JSON.parse(
    fs.readFileSync(`tutorials/${tutorialPath}`, 'utf8')
  ) as any;

  const startProject = await new ProjectModel({
    ...tutorialJson.startProject,
    ownerId: new mongoose.Types.ObjectId(ownerId),
    name: tutorialJson.name,
    description: tutorialJson.description,
    visibility: 'private',
  }).save();

  const startProjectId = startProject._id;

  tutorialJson.ownerId = new mongoose.Types.ObjectId(ownerId);
  tutorialJson.startProject = new mongoose.Types.ObjectId(startProjectId);
  tutorialJson.nextTutorials = [];

  const requiredTutorialIds = [];
  for (const tutorialName of tutorialJson.requiredTutorials) {
    const tutorial = await TutorialModel.findOne({ name: tutorialName });
    requiredTutorialIds.push(tutorial?._id);
  }
  tutorialJson.requiredTutorials = requiredTutorialIds;

  await new TutorialModel(tutorialJson).save();
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string, {
    dbName: process.env.DB_NAME,
  });
  console.log('Connected to database');

  for (const tutorialPath of tutorials) {
    await createTutorial(tutorialPath);
  }
  console.log('Tutorials created');

  await mongoose.disconnect();
}

main();
