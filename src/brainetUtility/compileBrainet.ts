import { spawn } from 'child_process';
import path from 'path';

export const compileBrainet = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const command = 'g++';

    const outputPath = path.join(
      __dirname,
      '../..',
      process.env.BRAINET_PATH!,
      process.env.BRAINET_RUN_JSON_FILENAME!
    );

    const inputPath = path.join(
      __dirname,
      '../..',
      process.env.BRAINET_PATH!,
      process.env.BRAINET_CPP_FILENAME!
    );

    const args = [
      '-o',
      outputPath,
      `-std=${process.env.CPP_VERSION}`,
      inputPath,
    ];

    console.log('Starting compilation process...');
    const compileProcess = spawn(command, args);

    compileProcess.stdout.on('data', (data) => {
      console.log(`compiler: ${data.toString()}`);
    });

    compileProcess.stderr.on('data', (data) => {
      console.error(`compiler: ${data.toString()}`);
    });

    compileProcess.on('close', (code: number) => {
      if (code === 0) {
        console.log('Compilation process finished successfully');
      } else {
        console.error(`Compilation process exited with exit code ${code}`);
      }
      resolve(code);
    });

    compileProcess.on('error', (err) => {
      console.error(`Failed to start compiler: ${err.message}`);
      resolve(1);
    });
  });
};
