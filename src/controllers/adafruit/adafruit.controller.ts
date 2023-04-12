import Controller from 'interfaces/controller.interface';
import * as express from 'express';
import axios from 'axios';
import { Observer } from '../../observer';
import Client from 'src/client';
import Database from 'src/database';
import Logger from 'src/logger';

class AdafruitController implements Controller, Observer {
  public path = '/adafruit';
  public router = express.Router();
  private clients = Client.getInstance().getClients();
  private ThresHold = Database.getInstance().ThresHold;
  private Logger: Logger

  constructor(Logger: Logger) {
    this.initializeRoute();
    this.Logger = Logger
  }

  update(data: any) {
    this.clients.forEach((client) => {
      client.send(data);
    });
  }

  private initializeRoute() {
    this.router.get(`${this.path}/:feedKey`, this.getFeedData);
    this.router.post(`${this.path}/:feedKey/:data`, this.updateFeedData);
    this.router.get(`${this.path}/:feedKey/latest`, this.getLatestData);
    this.router.post(`${this.path}/:feedKey/:min/:max`, this.updateThresHold);
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

  private updateThresHold = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { feedKey, min, max } = request.params;
    const dataObject = {
      feed_key: feedKey,
      min: min,
      max: max,
    };
    await this.ThresHold.findOneAndUpdate(
      { feed_key: dataObject.feed_key },
      {
        min: dataObject.min,
        max: dataObject.max,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    await this.Logger.getAndUpdateThresHold()
    response.send('success');
  };
}
export default AdafruitController;
