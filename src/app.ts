import { isCelebrateError } from "celebrate";
import express, { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import cardRoutes from "./routes/cards";
import authRoutes from "./routes/auth";
import authMiddleware from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";
import AppError from "./config/appError";

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(requestLogger);

// Публичные маршруты
app.use("/", authRoutes);
// Приватные роуты
app.use("/users", authMiddleware, userRoutes);
app.use("/cards", authMiddleware, cardRoutes);

app.use(errorLogger);
app.use((_req, res) => {
  res.status(404).json({ message: "Ресурс не найден" });
});
// app.use(celebrateErrors());
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response<{ message: string }>,
    // eslint-disable-next-line no-unused-vars
    _next: NextFunction
  ) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).send({ message: err.message });
      return;
    }
    if (isCelebrateError(err)) {
      res.status(400).send({ message: "Ошибка валидации" });
      return;
    }
    res.status(500).send({ message: "На сервере произошла ошибка" });
  }
);

app.listen(PORT, () => {
  console.log("Started server");
});

// подключаемся к серверу MongoDB
mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
  console.log("db cconnected");
});
