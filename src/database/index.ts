import mongoose from "mongoose"

class Database {
  private static _instance: Database;

  private constructor() {
    // Initialize mongo
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.MONGO_ENDPOINT}`)
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new Database();
    }
    return this._instance;
  }
}

export default Database;
