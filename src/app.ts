import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import cardRoutes from "./routes/cards";
import authRoutes from "./routes/auth";
import authMiddleware from "./middlewares/auth";
import { requestLogger, errorLogger } from "./middlewares/logger";

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
app.use((req, res) => {
  res.status(404).json({ message: "Ресурс не найден" });
});

app.listen(PORT, () => {
  console.log("Started server");
});

// подключаемся к серверу MongoDB
mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
  console.log("db cconnected");
});
