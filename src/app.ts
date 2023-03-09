import Database from './database';
import * as express from 'express';
import Controller from 'interfaces/controller.interface';

class App {
  private app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.initializeDatabaseConnection();
    this.initializeControllers(controllers)
  }

  private initializeDatabaseConnection = () => {
    Database.getInstance();
  };

  private initializeControllers = (controllers: Controller[]) => {
    controllers.forEach(controller => {
      this.app.use("/api", controller.router)
    })
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server listening on port: ${process.env.PORT}`);
    });
  }
}

export default App;
