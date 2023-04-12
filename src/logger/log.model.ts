import mongoose from 'mongoose';
import Log from './log.interface';

export const logSchema = new mongoose.Schema<Log>({
  time: { type: Date, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  feed_key: { type: String, required: true },
});

const LogModel = mongoose.model<Log & mongoose.Document>('Log', logSchema);
export default LogModel;
