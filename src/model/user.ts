import mongoose from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minLenght: 2,
    maxLength: 30,
    required: true,
  },
  about: {
    type: String,
    minLenght: 2,
    maxLength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});
export type { IUser };
export default mongoose.model<IUser>("user", userSchema);
