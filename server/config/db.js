import mongoose from 'mongoose';

export default async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set. Add it to the root .env file.');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}