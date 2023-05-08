import Client from 'src/client';
import Database from 'src/database';
import { Observer } from 'src/observer';
import { sendEmail } from 'utils/email';

class Logger implements Observer {
  private log = Database.getInstance().Log;
  private clients = Client.getInstance().getClients();
  private threshold = Database.getInstance().ThresHold;
  private thresholds = {}

  constructor() {
    console.log("LOGGER INITIALIZING")
    this.initializeDatabaseConnection()
    this.getAndUpdateThresHold()
  }
  private initializeDatabaseConnection = () => {
    Database.getInstance();
  };

  public getAndUpdateThresHold = async () => {
    const thresholds = await this.threshold.find()
    thresholds.forEach(threshold => {
      this.thresholds[threshold.feed_key] = {
        min: threshold.min, 
        max: threshold.max
      }
    })
    console.log("THRESHOLD: ", this.thresholds)
  };

  update(data: any): void {
    // console.log('LOGGER');
    // console.log(data);
    const extractedData = data[0];
    const [isExceed, status] = this.checkThreshold(
      extractedData.feed_key,
      extractedData.value
    );
    const message = this.genMessageTemplate(
      extractedData.feed_key,
      extractedData.value,
      status
    );
    let type = undefined;
    if (isExceed) {
      type = '[WARNING]';
      this.sendLog('[WARNING]', message);
      // sendEmail(message);
    } else {
      type = '[EVENT]';
      this.sendLog('[EVENT]', message);
    }
    this.save(type, message, extractedData.feed_key);
    data.pop();
  }

  // Check if data exceed threshold
  private checkThreshold(feedKey: string, value: number): [boolean, string] {
    let result: [boolean, string] = [false, 'normal'];
    if (this.thresholds[feedKey]) {
      if (
        value < this.thresholds[feedKey].min ||
        value > this.thresholds[feedKey].max
      ) {
        result =
          value < this.thresholds[feedKey].min
            ? [true, 'too low']
            : [true, 'too high'];
      }
    }
    if (result[0]) {
      // Send email
    }
    return result;
  }

  private genMessageTemplate(
    feedKey: string,
    value: number,
    status: string
  ): string {
    return `Device reported ${feedKey} data with value of ${value} which is ${status.toUpperCase()}`;
  }

  // Send log to client
  private sendLog(type: string, message: string): void {
    const responseMessage = {
      type: type,
      message: message,
      created_at: new Date(),
    };
    console.log('SEND LOG: ', JSON.stringify(responseMessage));
    this.clients.forEach((client) => {
      client.send(JSON.stringify(responseMessage));
    });
  }

  // Save to MongoDB
  private save(type: string, message: string, feed_key: string): void {
    const dataObject = {
      time: new Date(),
      type: type,
      content: message,
      feed_key: feed_key,
    };
    const savedData = new this.log(dataObject);
    console.log(`Saved to database for ${feed_key} field`);
    savedData.save();
  }
}

export default Logger;
