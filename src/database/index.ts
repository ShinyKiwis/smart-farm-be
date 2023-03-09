import mongoose from "mongoose"
import User from "src/users/user.interface";
import UserModel from "../users/user.model"

interface Models {
  User: mongoose.Model<User & mongoose.Document>;
}

class Database {
  private static _instance: Database;
  private _models: Models;

  private constructor() {
    // Initialize mongo
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_ENDPOINT}`)
    this._models = {
      User: UserModel
    }
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new Database();
    }
    return this._instance;
  }

}

export default Database;
