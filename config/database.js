const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant';
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10
});

async function connectDB() {
  let retries = 3;
  while (retries > 0) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      
      await client.db('restaurant').command({ ping: 1 });
      console.log('Database connection test successful');
      return client;
    } catch (error) {
      console.error(`MongoDB connection attempt failed. Retries left: ${retries - 1}`);
      retries--;
      if (retries === 0) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

module.exports = { connectDB, client };