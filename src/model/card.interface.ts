import mongoose from "mongoose";

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: mongoose.Schema.Types.Date;
}

export type { ICard };
