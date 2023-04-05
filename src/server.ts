import App from 'app';
import * as dotenv from 'dotenv';
import Controller from 'interfaces/controller.interface';
import validateEnv from 'utils/validateEnv';
import AdafruitController from './controllers/adafruit/adafruit.controller';
import UserController from './controllers/users/user.controller';
import { Observer } from './observer';
import RTData from './subject';

dotenv.config();
validateEnv();

const observers = [new AdafruitController()];

const app = new App([new UserController(), ...observers]);
const RTSubject = new RTData();
observers.forEach((controller) => {
  RTSubject.attach(controller);
});

app.listen();
