import { Router } from "express";
import { createUser, login } from "../controller/users";

const route = Router();

// POST /signin — авторизация
route.post("/signin", login);

// POST /users — создаёт пользователя
route.post("/signup", createUser);

export default route;
