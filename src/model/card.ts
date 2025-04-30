import mongoose from "mongoose";
import ICard from "./card.interface";

const cardSchema = new mongoose.Schema<ICard>({
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },
  link: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});

export default mongoose.model<ICard>("card", cardSchema);
