import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import mongoose from "mongoose";
import userRoutes from "./src/routes/users";

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log("hella wodrl");
});

// подключаемся к серверу MongoDB
mongoose.connect("mongodb://localhost:27017/users").then(() => {
  console.log("db cconnected");
});
