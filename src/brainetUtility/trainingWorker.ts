import { connectToDatabase } from '../utility/connectToDatabase';
import { trainModel } from './trainModel';
import { updateTaskJson } from './updateTaskJson';

export async function trainingWorker() {
  const db = await connectToDatabase();
  const dbqueue = db.collection('training_queue');
  const dbtrainings = db.collection('trainings');

  while (true) {
    const queueItem = await dbqueue.findOneAndDelete({});

    if (queueItem === null) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      continue;
    }

    const model = await dbtrainings.findOne({ _id: queueItem.model_id });

    updateTaskJson(model!.task);

    await dbtrainings.updateOne(
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
