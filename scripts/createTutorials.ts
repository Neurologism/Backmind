import mongoose from 'mongoose';
import fs from 'fs';
import { TutorialModel } from '../src/mongooseSchemas/tutorialSchema';
import { ProjectModel } from '../src/mongooseSchemas/projectSchema';

require('dotenv').config();

const ownerId = '675364cf0a29e18025fd1d0b';
const tutorials = [
  'intro/1.json',
  'intro/2.json',
  'intro/3.json',
  'intro/4.json',
  'intro/5.json',
  'intro/6.json',
  'intro/7.json',
];

async function createTutorial(tutorialPath: string) {
  const tutorialJson = JSON.parse(
    fs.readFileSync(`../tutorials/${tutorialPath}`, 'utf8')
  ) as any;

  if (await TutorialModel.findOne({ name: tutorialJson.name })) {
    const tutorial = await TutorialModel.findOne({ name: tutorialJson.name });
    const startProjectId = tutorial?.startProject;
    await ProjectModel.updateOne(
      { _id: startProjectId },
      {
        components: tutorialJson.startProject,
        ownerId: new mongoose.Types.ObjectId(ownerId),
      }
    );
    await TutorialModel.updateOne(
      { name: tutorialJson.name },
      {
        ...tutorialJson,
        ownerId: new mongoose.Types.ObjectId(ownerId),
        startProject: startProjectId,
      }
    );
    if (process.env.DELETE_PROJECTS === 'true') {
      await ProjectModel.deleteMany({
        tutorialId: tutorial?._id,
        _id: { $ne: startProjectId },
      });
    }
  } else {
    const startProject = await new ProjectModel({
      components: tutorialJson.startProject,
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
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string, {
    dbName: process.env.DB_NAME,
  });
  console.log('Connected to database');

  for (const tutorialPath of tutorials) {
    await createTutorial(tutorialPath);
  }

  await mongoose.disconnect();
}

main();
