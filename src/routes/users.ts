import { getUsers, createUser, getUserById } from "../controller/users";
import { Router } from "express";

const route = Router();

// GET /users — возвращает всех пользователей
route.get("/users", getUsers);

// GET /users/:userId - возвращает пользователя по _id
route.get("/users/:id", getUserById);

// POST /users — создаёт пользователя
route.post("/users", createUser);

export default route;
