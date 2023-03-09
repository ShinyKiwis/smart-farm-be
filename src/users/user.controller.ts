import Controller from "interfaces/controller.interface";
import * as express from 'express';
import UserModel from "./user.model";


class UserController implements Controller {
    public path="/user"
    public router = express.Router()
    private user = UserModel

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get(this.path, this.getAllUsers)
    }

    private async getAllUsers () {
        const all = await this.user.find()
        console.log(all)
    }
}

export default UserController