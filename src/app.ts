import express from "express";
import mongoose from "mongoose";

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log("hella wodrl");
});

// подключаемся к серверу MongoDB
mongoose.connect("mongodb://localhost:27017/sport");

app.use("/", (req, res) => {
  res.status(200);
  res.send({
    message: "Hi wordl",
  });
});
