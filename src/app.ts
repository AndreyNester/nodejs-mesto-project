import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";

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
      _id: "680ce67e68cdbbb354bbd455", // вставьте сюда _id созданного в предыдущем пункте пользователя
    };
    next();
  }
);

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log("hella wodrl");
});

// подключаемся к серверу MongoDB
mongoose.connect("mongodb://localhost:27017/users").then(() => {
  console.log("db cconnected");
});
