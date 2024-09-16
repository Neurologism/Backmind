import { spawn } from 'child_process';
import path from 'path';
import { connectToDatabase } from '../utility/connectToDatabase';
import { ObjectId } from 'mongodb';

export const trainModel = (model_id: ObjectId): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    const db = await connectToDatabase();
    const dbModels = db.collection('models');

    const workingDirectory = path.join(
      __dirname,
      '../..',
      process.env.BRAINET_PATH!
    );
    const command = path.join(
      workingDirectory,
      process.env.BRAINET_RUN_JSON_FILENAME!
    );

    console.log('Starting training...');
    const trainProcess = spawn(command, [], { cwd: workingDirectory });

    trainProcess.stdout.on('data', async (data) => {
      console.log(`compiler: ${data.toString()}`);
      await dbModels.updateOne(
        {
          _id: model_id,
        },
        {
          $push: {
            output: data.toString(),
          },
        }
      );
    });

    trainProcess.stderr.on('data', async (data) => {
      console.error(`compiler: ${data.toString()}`);
      await dbModels.updateOne(
        {
          _id: model_id,
        },
        {
          $push: {
            output: data.toString(),
          },
        }
      );
    });

    trainProcess.on('close', async (code: number) => {
      if (code === 0) {
        console.log('Training process finished successfully');
      } else {
        console.error(`Training process failed with exit code ${code}`);
      }
      await dbModels.updateOne(
        {
          _id: model_id,
        },
        {
          $set: {
            status: code === 0 ? 'finished' : 'error',
            finished_at: Date.now(),
          },
        }
      );
      resolve(code);
    });

    trainProcess.on('error', async (err) => {
      console.error(`Training failed: ${err.message}`);
      await dbModels.updateOne(
        { _id: model_id },
        { $set: { status: 'error', error: err, finished_at: Date.now() } }
      );
      resolve(1);
    });

    while (true) {
      const model: any = dbModels.findOne({ _id: model_id });

      if (model.status === 'stopped') {
        trainProcess.kill();
        console.log('Training process stopped');
        resolve(0);
      }

      dbModels.updateOne(
        { _id: model_id },
        { $set: { last_updated: Date.now() } }
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
};
