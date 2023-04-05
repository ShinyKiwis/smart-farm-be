import mongoose from 'mongoose';
import Log from './log.interface';

export const logSchema = new mongoose.Schema<Log>({
  id: { type: String, required: true },
  time: { type: Date, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  feed_id: { type: String, required: true },
});

const LogModel = mongoose.model<Log & mongoose.Document>('Log', logSchema);
export default LogModel;
