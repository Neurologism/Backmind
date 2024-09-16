import { connectToDatabase } from '../utility/connectToDatabase';
import { trainModel } from './trainModel';
import { updateTaskJson } from './updateTaskJson';

export async function trainingWorker() {
  const db = await connectToDatabase();
  const dbTrainingQueue = db.collection('training_queue');
  const dbModels = db.collection('models');

  while (true) {
    const queueItem = await dbTrainingQueue.findOneAndDelete({});

    if (queueItem === null) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      continue;
    }

    const model = await dbModels.findOne({ _id: queueItem.model_id });

    if (model === null) {
      console.error(`Model with id ${queueItem.model_id} not found`);
      continue;
    }

    updateTaskJson(model!.task);

    await dbModels.updateOne(
      { _id: model!._id },
      {
        $set: {
          status: 'training',
          last_updated: Date.now(),
          started_at: Date.now(),
        },
      }
    );

    await trainModel(model!._id);
  }
}
