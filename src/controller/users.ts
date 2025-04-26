import { RequestHandler } from "express";

export const getUsers: RequestHandler = (req, res) => {
  res.status(200).send("get users");
};

export const getUserById: RequestHandler = (req, res) => {
  res.status(200).send("get user by id");
};

export const createUser: RequestHandler = (req, res) => {
  res.status(200).send("register user");
};
