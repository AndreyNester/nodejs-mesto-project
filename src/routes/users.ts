import {
  getUsers,
  createUser,
  getUserById,
  updateAvatar,
  updateUser,
} from "../controller/users";
import { Router } from "express";

const route = Router();

// GET /users — возвращает всех пользователей
route.get("/users", getUsers);

// GET /users/:userId - возвращает пользователя по _id
route.get("/users/:id", getUserById);

// POST /users — создаёт пользователя
route.post("/users", createUser);

// PATCH /users/me — обновляет профиль
route.patch("/users/me", updateUser);

// PATCH /users/me/avatar — обновляет аватар
route.patch("/users/me/avatar", updateAvatar);

export default route;
