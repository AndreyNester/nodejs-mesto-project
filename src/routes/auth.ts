import { Router } from "express";
import { celebrate } from "celebrate";
import { createUser, login } from "../controller/users";
import {
  createUserValidationSchema,
  signInValidationSchema,
} from "../controller/users.validation";

const route = Router();
// краш роут
route.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

// POST /signin — авторизация
route.post("/signin", celebrate(signInValidationSchema), login);

// POST /users — создаёт пользователя
route.post("/signup", celebrate(createUserValidationSchema), createUser);

export default route;
