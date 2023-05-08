import * as express from 'express';
import Controller from 'interfaces/controller.interface';
import Database from 'src/database';

class LoggerController implements Controller {
  public router = express.Router();
  public path =  '/logger';
  log = Database.getInstance().Log;

  constructor() {
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get(`${this.path}/`, this.getAllLog);
    this.router.get(`${this.path}/daily`, this.getDailyLog);
  }

  private getAllLog = async (
    request: express.Request,
    response: express.Response
  ) => {
    const logs = await this.log.find();
    response.send(logs);
  };

  private getDailyLog = async (request: express.Request, response: express.Response) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const logs = await this.log.find({time: {$gte: today}});
    response.send(logs);
  }
}

export default LoggerController;
