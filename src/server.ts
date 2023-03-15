import App from 'app';
import * as dotenv from 'dotenv';
import validateEnv from 'utils/validateEnv';
import AdafruitController from './controllers/adafruit/adafruit.controller';
import UserController from './controllers/users/user.controller';

dotenv.config();
validateEnv();

const app = new App([new UserController(), new AdafruitController()]);

app.listen();
