import mongoose from 'mongoose';
import LOG from '../library/logging';

export const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME || 'doneos';
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }
    
    // Parse the URI to ensure we're using the correct database
    const uri = new URL(mongoURI);
    uri.pathname = `/${dbName}`;
    
    const options: mongoose.ConnectOptions = {
      dbName,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(uri.toString(), options);
    LOG.info(`MongoDB Connected Successfully to database: ${dbName}`);
  } catch (error) {
    LOG.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}; 