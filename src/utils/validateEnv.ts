import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    MONGO_USERNAME: str(),
    MONGO_PASSWORD: str(),
    MONGO_ENDPOINT: str(),
    ADAFRUIT_APIKEY: str()
  });
};

export default validateEnv;
