import { config } from '../config/app.config';
import mongoose from 'mongoose';


const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
export default connectToDatabase;