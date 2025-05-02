import validator from "validator";
import mongoose from "mongoose";
import IUser from "./user.interface";

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minLenght: 2,
    maxLength: 30,
    default: "Жак-Ив Кусто»",
  },
  about: {
    type: String,
    minLenght: 2,
    maxLength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "http://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email: string) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});
export type { IUser };
export default mongoose.model<IUser>("user", userSchema);
