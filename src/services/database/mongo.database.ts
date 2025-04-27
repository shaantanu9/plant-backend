import mongoose from 'mongoose';
import { CONFIG, SYS_ERR } from '../../common/config.common';
mongoose.set('strictQuery', false);

class MongoDatabase {
  constructor() {}

  public async connect() {
    try {
      mongoose.connect(CONFIG.MONGO_URI);
      console.log('FLAG - mongo uri: ', CONFIG.MONGO_URI);
      console.log('MongoDB Connected');

      mongoose.set('debug', true);
    } catch (error) {
      console.log('MongoDB Connection Failed');
      process.exit(SYS_ERR.MONGO_CONN_FAILED);
    }
  }
}

export const mongoDatabase = new MongoDatabase();
