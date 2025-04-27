import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import cardRoutes from "./routes/cards";

const { PORT = 3000 } = process.env;

export interface IAuthContext {
  user: {
    _id: string;
  };
}

const app = express();
app.use(express.json());

app.use(
  (req: Request, res: Response<unknown, IAuthContext>, next: NextFunction) => {
    res.locals.user = {
      _id: "680df2c96e9c021488f5fd3c",
    };
    next();
  }
);

app.use("/", userRoutes);
app.use("/", cardRoutes);

app.listen(PORT, () => {
  console.log("hella wodrl");
});

// подключаемся к серверу MongoDB
mongoose.connect("mongodb://localhost:27017/mydb").then(() => {
  console.log("db cconnected");
});
