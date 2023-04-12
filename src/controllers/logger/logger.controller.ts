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
  }

  private getAllLog = async (
    request: express.Request,
    response: express.Response
  ) => {
    const all = await this.log.find();
    response.send(all);
  };
}

export default LoggerController;
