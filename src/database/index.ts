import mongoose from 'mongoose';
import User from 'src/controllers/users/user.interface';
import UserModel from '../controllers/users/user.model';

interface Models {
  User: mongoose.Model<User & mongoose.Document>;
}

class Database {
  private static _instance: Database;
  private _models: Models;

  private constructor() {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_ENDPOINT
    } = process.env
    mongoose.connect(
      `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}${MONGO_ENDPOINT}`,
      {
        dbName: 'SmartFarm'
      }
    );
    this._models = {
      User: UserModel,
    };
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new Database();
    }
    return this._instance._models;
  }
}

export default Database;
