import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateAvatar,
  updateUser,
  getCurrentUser,
} from "../controller/users";

const route = Router();

// GET /users — возвращает всех пользователей
route.get("/", getUsers);

// GET /users/me - возвращает информацию о текущем пользователе
route.get("/me", getCurrentUser);

// GET /users/:userId - возвращает пользователя по _id
route.get("/:id", getUserById);

// PATCH /users/me — обновляет профиль
route.patch("/me", updateUser);

// PATCH /users/me/avatar — обновляет аватар
route.patch("/me/avatar", updateAvatar);

export default route;
