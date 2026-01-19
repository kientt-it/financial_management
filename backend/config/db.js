import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI;

export const connectDB = async () => {
  // Skip MongoDB if not configured
  if (!mongoUri) {
    console.log('ℹ️  MONGODB_URI not set - using in-memory mode');
    return false;
  }

  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('URI prefix:', mongoUri.substring(0, 20) + '...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    console.warn('⚠️  Falling back to in-memory mode');
    return false;
  }
};
