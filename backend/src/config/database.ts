import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = `mongodb+srv://db_user:XFHV0ey2Ncs2fYF6@cluster0.zlgalym.mongodb.net/?appName=Cluster0`;
    
    if (!mongoUri) {
      throw new Error('DB_URL environment variable is not defined');
    }

    await mongoose.connect(mongoUri);
    
    logger.info('✓ MongoDB Connected Successfully');
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB Disconnected');
    });
  } catch (error) {
    logger.error('MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
