import Controller from 'interfaces/controller.interface';
import * as express from 'express';
import Database from 'src/database';
import User from './user.interface';

class UserController implements Controller {
  public path = '/user';
  public router = express.Router();
  private user = Database.getInstance().User;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createUser);
  }

  private getAllUsers = async (request: express.Request, response: express.Response) => {
    const all = await this.user.find();
    response.send(all)
  }

  private createUser = (request: express.Request, response: express.Response) => {
    const userData: User = request.body
    console.log(userData)
    const createdUser = new this.user(userData)
    createdUser.save()
      .then(savedUser => {
        response.send(savedUser)
      })
  }
}

export default UserController;
