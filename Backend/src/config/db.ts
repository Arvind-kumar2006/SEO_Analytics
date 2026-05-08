import mongoose from 'mongoose';

// Cache the connection across serverless function invocations.
// On Vercel, each cold start re-imports the module but the cached
// connection is reused if the container is still warm.
let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return; // Reuse existing connection
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for serverless cold starts
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Do NOT call process.exit(1) in serverless — it kills the function container.
    // Let the error propagate so the request returns a 500 instead.
    throw error;
  }
};

export default connectDB;