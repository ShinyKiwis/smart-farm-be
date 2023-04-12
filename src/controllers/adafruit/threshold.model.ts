import mongoose from 'mongoose';
import ThresHold from './threshold.interface';

export const thresHoldSchema = new mongoose.Schema<ThresHold>({
  feed_key: {type: String, required: true},
  min: {type: Number, required: true},
  max: {type: Number, required: true},
});

const ThresHoldModel = mongoose.model<ThresHold & mongoose.Document>('threshold', thresHoldSchema);
export default ThresHoldModel;

