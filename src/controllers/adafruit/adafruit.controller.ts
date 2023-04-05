import Controller from 'interfaces/controller.interface';
import * as express from 'express';
import axios from 'axios';
import { Observer } from '../../observer';
import Client from 'src/client';

class AdafruitController implements Controller, Observer {
  public path = '/adafruit';
  public router = express.Router();
  private clients = Client.getInstance().getClients();

  constructor() {
    this.initializeRoute();
  }

  update(data: any) {
    console.log(data);
    this.clients.forEach((client) => {
      client.send(data);
    });
  }

  private initializeRoute() {
    this.router.get(`${this.path}/:feedKey`, this.getFeedData);
    this.router.post(`${this.path}/:feedKey/:data`, this.updateFeedData);
    this.router.get(`${this.path}/:feedKey/latest`, this.getLatestData);
  }

  private getFeedData = (
    request: express.Request,
    response: express.Response
  ) => {
    const { feedKey } = request.params;
    axios
      .get(`https://io.adafruit.com/api/v2/meodihere/feeds/${feedKey}/data`, {
        params: {
          'x-aio-key': process.env.ADAFRUIT_APIKEY,
        },
      })
      .then((res) => {
        response.send(JSON.stringify(res.data));
        this.update(JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  private updateFeedData = (
    request: express.Request,
    response: express.Response
  ) => {
    const { feedKey, data } = request.params;
    axios
      .post(
        `https://io.adafruit.com/api/v2/meodihere/feeds/${feedKey}/data`,
        {
          value: data,
        },
        {
          params: {
            'x-aio-key': process.env.ADAFRUIT_APIKEY,
          },
        }
      )
      .then(() => {
        response.send('success');
      });
  };

  private getLatestData = (
    request: express.Request,
    response: express.Response
  ) => {
    const { feedKey } = request.params;
    axios
      .get(
        `https://io.adafruit.com/api/v2/meodihere/feeds/${feedKey}/data/retain`,
        {
          params: {
            'x-aio-key': process.env.ADAFRUIT_APIKEY,
          },
        }
      )
      .then((res) => {
        response.send(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
export default AdafruitController;
