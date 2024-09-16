import { connectToDatabase } from '../utility/connectToDatabase';

export async function trainingWorker() {
  const db = await connectToDatabase();
  const dbqueue = db.collection('training_queue');
  const dbtrainings = db.collection('trainings');

  while (true) {
    const trainJob = await dbqueue.findOneAndDelete({});

    // TODO
  }
}
