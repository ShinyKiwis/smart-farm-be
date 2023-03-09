import mongoose from 'mongoose';
import User from './user.interface';

export const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});
const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);
export default UserModel;
