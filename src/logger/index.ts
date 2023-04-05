import Database from 'src/database';
import { Observer } from 'src/observer';

class Logger implements Observer {
  private log = Database.getInstance().Log;
  update(data: any): void {}

  private checkThreshold(feedKey, value): boolean {
    return false;
  }

  private sendLog(type, message): void {}

  private save(): void {}
}

export default Logger;
