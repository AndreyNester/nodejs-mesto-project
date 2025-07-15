import cors from "cors";
import dotenv from "dotenv";
import { isCelebrateError } from "celebrate";
import express, { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import cardRoutes from "./routes/cards";
import authRoutes from "./routes/auth";
import authMiddleware from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";

import AppError from "./config/appError";
import NotFoundError from "./config/notFoundError";

// Загружает переменные из .env в process.env
dotenv.config();

const { PORT = process.env.PORT || 3000 } = process.env;

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://nesterok.frontend.nomorepartiessbs.ru",
  "https://nesterok.frontend.nomorepartiessbs.ru",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use(requestLogger);

// Публичные маршруты
app.use("/", authRoutes);
// Приватные роуты
app.use("/users", authMiddleware, userRoutes);
app.use("/cards", authMiddleware, cardRoutes);

app.use(errorLogger);
app.use((_req, res, next) => {
  try {
    throw new NotFoundError("Ресурс не найден");
  } catch (err) {
    next(err);
  }
});
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
  console.log(`Started server at localhost:${PORT}`);
});

// подключаемся к серверу MongoDB
mongoose.connect(process.env.MONGO_URI || "jj").then(() => {
  console.log(`db cconnected at ${process.env.MONGO_URI || "jj"}`);
});
