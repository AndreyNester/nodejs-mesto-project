import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log("hella wodrl");
});

// подключаемся к серверу MongoDB
mongoose.connect("mongodb://localhost:27017/sport");
