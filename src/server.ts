import App from 'app';
import * as dotenv from 'dotenv';
import validateEnv from 'utils/validateEnv';
import AdafruitController from './controllers/adafruit/adafruit.controller';
import LoggerController from './controllers/logger/logger.controller';
import UserController from './controllers/users/user.controller';
import Logger from './logger';
import RTData from './subject';

dotenv.config();
validateEnv();

const LoggerObject = new Logger()
const observers = [new AdafruitController(LoggerObject)];

const app = new App([new UserController(), new LoggerController(), ...observers]);
const RTSubject = new RTData();
observers.forEach((observer) => {
  RTSubject.attach(observer);
});
RTSubject.attach(LoggerObject)

app.listen();
