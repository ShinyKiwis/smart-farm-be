import * as express from 'express';
import Controller from 'interfaces/controller.interface';
import Database from 'src/database';

class LoggerController implements Controller {
  public router = express.Router();
  public path = '/logger';
  log = Database.getInstance().Log;

  constructor() {
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get(`${this.path}`, this.getLog);
    this.router.get(`${this.path}/daily`, this.getDailyLog);
  }

  private getLog = async (
    request: express.Request,
    response: express.Response
  ) => {
    const page = parseInt(request.query.page as string) || 1;
    const logsPerPage = 10;
    const logs = await this.log
      .find()
      .sort({ time: -1 })
      .skip((page - 1) * logsPerPage)
      .limit(logsPerPage)
      .exec();
    const count = await this.log.count();
    response.send(
      JSON.stringify({
        totalPages: Math.ceil(count / logsPerPage),
        currentPage: page,
        logs: logs,
      })
    );
  };

  private getDailyLog = async (
    request: express.Request,
    response: express.Response
  ) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const logs = await this.log.find({ time: { $gte: today } });
    response.send(logs);
  };
}

export default LoggerController;
