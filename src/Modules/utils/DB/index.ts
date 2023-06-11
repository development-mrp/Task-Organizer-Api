import mongoose from 'mongoose';

export default class MongoClient {
  public static $_instance: (MongoClient | null) = null;

  public static instance() {
    if (!MongoClient.$_instance) {
      MongoClient.$_instance = new MongoClient;
    }

    return MongoClient.$_instance;
  }

  private constructor() {}

  public async connectMongoose() {
    mongoose.Promise = global.Promise;

    mongoose.set('strictQuery', true);
    
    mongoose.connect(process.env.DB_LINK);
    
    return true;
  }
}