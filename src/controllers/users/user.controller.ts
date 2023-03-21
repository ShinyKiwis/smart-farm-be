import Controller from 'interfaces/controller.interface';
import * as express from 'express';
import * as bcrypt from 'bcrypt';
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
    this.router.get(`${this.path}/:username/:password`, this.getUser);
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createUser);
  }

  private getAllUsers = async (
    request: express.Request,
    response: express.Response
  ) => {
    const all = await this.user.find();
    response.send(all);
  };

  private getUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const {username, password} = request.params
    this.user.findOne({username: username})
      .then(async (user) => {
        const passwordMatched = await bcrypt.compare(password, user.password)
        if(user.username == username && passwordMatched) {
          response.send(JSON.stringify({status: true}))
        }else {
          response.send(JSON.stringify({status: false}))
        }
      })
      .catch(_ => {
        response.send(JSON.stringify({error: "User not existed!"}))
      })
  };

  private createUser = async (
    request: express.Request,
    response: express.Response
  ) => {
    let userData: User = request.body;
    const existed = this.user.findOne({ username: userData.username });
    if (!existed) {
      bcrypt.hash(userData.password, 10, (err, result) => {
        userData = { ...userData, password: result };
        const createdUser = new this.user(userData);
        createdUser.save().then((savedUser) => {
          response.send(savedUser);
        });
      });
    } else {
      response.send('User exited!');
    }
  };
}

export default UserController;
