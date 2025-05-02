import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import IAuthContext from "./types";
import userRoutes from "./routes/users";
import cardRoutes from "./routes/cards";

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use(
  (_req: Request, res: Response<unknown, IAuthContext>, next: NextFunction) => {
    res.locals.user = {
      _id: "68132fa573ffc46f70b50c20",
    };
    next();
  }
);

app.use("/", userRoutes);
app.use("/", cardRoutes);
app.listen(PORT, () => {
  console.log("Started server");
});

app.use((req: Request, res: Response) => {
  res.status(404).send({
    message: "Такого ресурса не существует",
  });
});

// подключаемся к серверу MongoDB
mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
  console.log("db cconnected");
});
