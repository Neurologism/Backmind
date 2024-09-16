import { spawn } from 'child_process';
import path from 'path';
import { connectToDatabase } from '../utility/connectToDatabase';

export const trainModel = (): Promise<number> => {
  return new Promise((resolve, reject) => {
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

    trainProcess.stdout.on('data', (data) => {
      console.log(`compiler: ${data.toString()}`);
    });

    trainProcess.stderr.on('data', (data) => {
      console.error(`compiler: ${data.toString()}`);
    });

    trainProcess.on('close', (code: number) => {
      if (code === 0) {
        console.log('Training process finished successfully');
      } else {
        console.error(`Training process failed with exit code ${code}`);
      }
      resolve(code);
    });

    trainProcess.on('error', (err) => {
      console.error(`Training failed: ${err.message}`);
      resolve(1);
    });
  });
};
