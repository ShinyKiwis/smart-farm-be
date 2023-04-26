import mongoose from 'mongoose';
import Schedule from 'src/controllers/adafruit/schedule.interface';
import ScheduleModel from 'src/controllers/adafruit/schedule.model';
import ThresHold from 'src/controllers/adafruit/threshold.interface';
import ThresHoldModel from 'src/controllers/adafruit/threshold.model';
import User from 'src/controllers/users/user.interface';
import Log from 'src/logger/log.interface';
import LogModel from 'src/logger/log.model';
import UserModel from '../controllers/users/user.model';

interface Models {
  User: mongoose.Model<User & mongoose.Document>;
  Log: mongoose.Model<Log & mongoose.Document>;
  ThresHold: mongoose.Model<ThresHold & mongoose.Document>;
  Schedule: mongoose.Model<Schedule & mongoose.Document>;
}

class Database {
  private static _instance: Database;
  private _models: Models;

  private constructor() {
    const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_ENDPOINT } = process.env;
    mongoose.connect(
      `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}${MONGO_ENDPOINT}`,
      {
        dbName: 'SmartFarm',
      }
    );
    this._models = {
      User: UserModel,
      Log: LogModel,
      ThresHold: ThresHoldModel,
      Schedule: ScheduleModel
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
