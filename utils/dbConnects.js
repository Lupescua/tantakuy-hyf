import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

export default async function dbConnect() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      bufferCommands: false,
    });
    console.log('Database connection successful!');
  } catch (error) {
    console.error('MongoDb connection error: ', error);
    throw error;
  }
}
