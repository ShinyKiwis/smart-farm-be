import Client from 'src/client';
import Database from 'src/database';
import { Observer } from 'src/observer';

class Logger implements Observer {
  private log = Database.getInstance().Log;
  private clients = Client.getInstance().getClients();
  private thresholds = {
    temperature: {
      min: 20,
      max: 40,
    },
    moisture: {
      min: 25,
      max: 50,
    },
    humidity: {
      min: 30,
      max: 50,
    },
    gdd: {
      min: 4,
      max: 10,
    },
  };

  update(data: any): void {
    // console.log('LOGGER');
    // console.log(data);
    const extractedData = data[0];
    const [isExceed, status] = this.checkThreshold(
      extractedData.feed_key,
      extractedData.value
    );
    if (isExceed) {
      this.sendLog(
        '[WARNING]',
        this.genMessageTemplate(
          extractedData.feed_key,
          extractedData.value,
          status
        )
      );
    } else {
      this.sendLog(
        '[EVENT]',
        this.genMessageTemplate(
          extractedData.feed_key,
          extractedData.value,
          status
        )
      );
    }
    data.pop();
  }

  // Check if data exceed threshold
  private checkThreshold(feedKey: string, value: number): [boolean, string] {
    let result: [boolean, string] = [false, 'normal'];
    console.log(feedKey);
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
    };
    console.log('SEND LOG: ', JSON.stringify(responseMessage));
    this.clients.forEach((client) => {
      client.send(JSON.stringify(responseMessage));
    });
  }

  // Save to MongoDB
  private save(): void {}
}

export default Logger;
