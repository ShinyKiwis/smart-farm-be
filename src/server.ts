import App from 'app';
import * as dotenv from 'dotenv';
import validateEnv from 'utils/validateEnv';
import UserController from './users/user.controller';

dotenv.config();
validateEnv();

const app = new App([new UserController()]);

app.listen();
