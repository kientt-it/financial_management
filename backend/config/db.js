import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-manager';

export const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('URI:', mongoUri.split('@')[1] || 'local');
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};
