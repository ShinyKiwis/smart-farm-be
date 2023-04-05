import { Observer } from './observer';
import axios from 'axios';
import Controller from 'interfaces/controller.interface';

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class RTData implements Subject {
  private observers: Observer[] = [];
  private adafruitData = [];
  private feedKeys: string[] = [
    'temperature',
    'humidity',
    'moisture',
    'light',
    'gdd',
  ];

  public constructor() {
    this.feedKeys.forEach((feedKey) => {
      this.pollingData(feedKey);
    });
  }

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has already been attached');
    }
    console.log('Subject: Attached an observer');
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer');
    }
    this.observers.splice(observerIndex, 1);
  }

  public notify(): void {
    console.log('Subject: Notifying observers');
    for (const observer of this.observers) {
      //
      observer.update(this.adafruitData);
    }
  }

  private pollingData = (feedKey: string) => {
    setInterval(async () => {
      const { data } = await axios.get(
        `https://io.adafruit.com/api/v2/meodihere/feeds/${feedKey}/data/last`,
        {
          params: {
            'x-aio-key': process.env.ADAFRUIT_APIKEY,
          },
        }
      );
      this.adafruitData.push({ ...data, feed_key: `${feedKey}` });
      this.notify();
    }, 35000);
  };
}

export default RTData;
