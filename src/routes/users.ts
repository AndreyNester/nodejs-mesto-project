import { Router } from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateUser,
  login,
} from "../controller/users";

const route = Router();

// GET /users — возвращает всех пользователей
route.get("/users", getUsers);

// GET /users/:userId - возвращает пользователя по _id
route.get("/users/:id", getUserById);

// route.post("/users", createUser);

// PATCH /users/me — обновляет профиль
route.patch("/users/me", updateUser);

// PATCH /users/me/avatar — обновляет аватар
route.patch("/users/me/avatar", updateAvatar);

// POST /signin — авторизация
route.post("/signin", login);

// POST /users — создаёт пользователя
route.post("/signup", createUser);

export default route;
