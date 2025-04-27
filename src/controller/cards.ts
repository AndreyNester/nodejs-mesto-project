import { RequestHandler } from "express";

export const getCards: RequestHandler = (_req, res) => {
  res.status(200).send("get cards");
};
export const createCard: RequestHandler = (req, res) => {
  res.status(200).send("create card");
};

export const deleteCard: RequestHandler = (req, res) => {
  res.status(200).send("delete card");
};
