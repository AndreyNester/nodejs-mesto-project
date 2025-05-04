import { Router } from "express";
import { celebrate } from "celebrate";
import { createUser, login } from "../controller/users";
import {
  createUserValidationSchema,
  signInValidationSchema,
} from "../controller/users.validation";

const route = Router();

// POST /signin — авторизация
route.post("/signin", celebrate(signInValidationSchema), login);

// POST /users — создаёт пользователя
route.post("/signup", celebrate(createUserValidationSchema), createUser);

export default route;
