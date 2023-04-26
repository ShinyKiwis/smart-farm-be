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
  private Schedule = Database.getInstance().Schedule;
  private Logger: Logger

  constructor(Logger: Logger) {
    this.initializeRoute();
    this.Logger = Logger
  }

  update(data: any) {
    this.clients.forEach((client) => {
      client.send(JSON.stringify(data[0]));
    });
  }

  private initializeRoute() {
    this.router.get(`${this.path}/threshold/`, this.getThresHold);
    this.router.post(`${this.path}/threshold/:feedKey/:min/:max`, this.updateThresHold);
    this.router.get(`${this.path}/feed/:feedKey`, this.getFeedData);
    this.router.post(`${this.path}/feed/:feedKey/:data`, this.updateFeedData);
    this.router.get(`${this.path}/feed/:feedKey/latest`, this.getLatestData);
    this.router.post(`${this.path}/schedule/:feedKey/:timeStart/:timeEnd/:dates`, this.setSchedule);
    this.router.get(`${this.path}/schedule/`, this.getSchedule);
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

  private getThresHold = async (request: express.Request, response: express.Response) => {
    try{
      const thresHolds = await this.ThresHold.find()
      response.send(thresHolds)
    }catch(err) {
      console.log("[ERROR]: ", err)
    }
  }

  private setSchedule = async (request: express.Request, response: express.Response) => {
    const {feedKey, timeStart, timeEnd, dates} = request.params
    const repeats = dates.replace('[','').replace(']','').split(',')
    console.log(feedKey)
    console.log(timeStart)
    console.log(timeEnd)
    console.log(dates[0])
    const newSchedule = new this.Schedule({feed_key: feedKey, timeStart,timeEnd,repeats})
    newSchedule.save()
    response.send("success")
  }

  private getSchedule = async (request: express.Request, response: express.Response) => {
    const schedules = await this.Schedule.find()
    response.send(schedules)
  }
}
export default AdafruitController;
