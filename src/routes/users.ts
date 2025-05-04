import { Router } from "express";
import { celebrate } from "celebrate";
import {
  getUsers,
  getUserById,
  updateAvatar,
  updateUser,
  getCurrentUser,
} from "../controller/users";
import {
  getUserByIdValidationSchema,
  updateAvatarValidationSchema,
  updateUserValidationhSchema,
} from "../controller/users.validation";

const route = Router();

// GET /users — возвращает всех пользователей
route.get("/", getUsers);

// GET /users/me - возвращает информацию о текущем пользователе
route.get("/me", getCurrentUser);

// GET /users/:userId - возвращает пользователя по _id
route.get("/:id", celebrate(getUserByIdValidationSchema), getUserById);

// PATCH /users/me — обновляет профиль
route.patch("/me", celebrate(updateUserValidationhSchema), updateUser);

// PATCH /users/me/avatar — обновляет аватар
route.patch(
  "/me/avatar",
  celebrate(updateAvatarValidationSchema),
  updateAvatar
);

export default route;
