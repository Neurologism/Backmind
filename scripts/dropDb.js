const mongoose = require('mongoose');

require('dotenv').config();

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('Connected to database');

    await mongoose.connection.db.dropDatabase();
    console.log('Dropped database');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from the database');
  }
}

resetDatabase();
