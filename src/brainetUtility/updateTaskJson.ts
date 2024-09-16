import fs from 'fs';
import path from 'path';

export const updateTaskJson = (task: any) => {
  const jsonString = JSON.stringify(task);
  fs.writeFileSync(
    path.join(
      __dirname,
      '../..',
      process.env.BRAINET_PATH!,
      process.env.BRAINET_TASK_JSON_FILENAME!
    ),
    jsonString
  );
};
