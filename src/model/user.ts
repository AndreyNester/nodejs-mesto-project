import mongoose from "mongoose";

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

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

export default mongoose.model<IUser>("user", userSchema);
