import mongoose from 'mongoose';
import Schedule from './schedule.interface';

export const scheduleSchema = new mongoose.Schema<Schedule>({
  feed_key: {type: String, required: true},
  timeStart: {type: String, required: true},
  timeEnd: {type: String, required: true},
  repeats: {type: [String], required: true},
});

const ScheduleModel = mongoose.model<Schedule & mongoose.Document>('schedule', scheduleSchema);
export default ScheduleModel;
