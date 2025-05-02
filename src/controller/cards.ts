import { RequestHandler } from "express";
import mongoose from "mongoose";
import IAuthContext from "../types";
import cardModel from "../model/card";
import {
  ICreateCardRequest,
  ICreateCardResponse,
  TGetCardResponse,
  IGetCard,
  ILikeCardResponse,
  IUnlikeCardResponse,
} from "./cards.interface";
import AppError from "../config/AppError";

export const getCards: RequestHandler<
  unknown,
  TGetCardResponse | { message: string }
> = async (_req, res) => {
  try {
    const cards = await cardModel.find({});
    const preparedResult = cards.map<IGetCard>(
      ({ link, name, id, createdAt, likes, owner }) => ({
        link,
        name,
        id,
        createdAt,
        likes,
        owner,
      })
    );
    res.status(200).send(preparedResult);
  } catch (err) {
    if (err instanceof AppError) {
      switch (err.name) {
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
    } else {
      res.status(500).send({ message: "ошибка на сервере" });
    }
  }
};
export const createCard: RequestHandler<
  unknown,
  ICreateCardResponse | { message: string },
  ICreateCardRequest,
  unknown,
  IAuthContext
> = async (req, res) => {
  try {
    const { name, link } = req.body;
    const { _id } = res.locals.user;

    const createdCard = await cardModel.create({
      name,
      owner: _id,
      link,
    });

    res.status(201).send({
      createdAt: createdCard.createdAt,
      id: createdCard.id,
      likes: createdCard.likes,
      link: createdCard.link,
      name: createdCard.name,
      owner: createdCard.owner,
    });
  } catch (err) {
    if (err instanceof AppError) {
      switch (err.name) {
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
    } else if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "Не корректно переданы данные" });
    } else {
      res.status(500).send({ message: "ошибка на сервере" });
    }
  }
};

export const deleteCard: RequestHandler<
  { id?: string },
  {
    message: string;
  }
> = async (req, res) => {
  try {
    const { id } = req.params;

    if (!(id && mongoose.isValidObjectId(id))) {
      throw new AppError("Bad Request Error");
    }
    const deletedCard = await cardModel.findByIdAndDelete(id);
    if (!deletedCard) {
      throw new AppError("Not Found Error");
    }
    res.status(200).send({
      message: "Карточка успешно удалена",
    });
  } catch (err) {
    if (err instanceof AppError) {
      switch (err.name) {
        case "Bad Request Error":
          res.status(400).send({ message: "Не корректно переданы данные" });
          break;
        case "Not Found Error":
          res.status(404).send({ message: "Карточка с таким ID не найдена" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
    } else if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "Не корректно переданы данные" });
    } else {
      res.status(500).send({ message: "ошибка на сервере" });
    }
  }
};
export const likeCard: RequestHandler<
  { cardId?: string },
  ILikeCardResponse | { message: string },
  unknown,
  unknown,
  IAuthContext
> = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!(cardId && mongoose.isValidObjectId(cardId))) {
      throw new AppError("Bad Request Error");
    }

    const { _id } = res.locals.user;

    const likedCard = await cardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true, runValidators: true }
    );
    if (!likedCard) {
      throw new AppError("Not Found Error");
    }

    res.status(200).send({
      createdAt: likedCard.createdAt,
      id: likedCard.id,
      likes: likedCard.likes,
      link: likedCard.link,
      name: likedCard.name,
      owner: likedCard.owner,
    });
  } catch (err) {
    if (err instanceof AppError) {
      switch (err.name) {
        case "Bad Request Error":
          res.status(400).send({ message: "не корректно переданы данные" });
          break;
        case "Not Found Error":
          res.status(404).send({ message: "Карточка с таким ID не найдена" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
    } else if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "Не корректно передаены данные" });
    } else {
      res.status(500).send({ message: "ошибка на сервере" });
    }
  }
};

export const unlikeCard: RequestHandler<
  { cardId?: string },
  IUnlikeCardResponse | { message: string },
  unknown,
  unknown,
  IAuthContext
> = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!(cardId && mongoose.isValidObjectId(cardId))) {
      throw new AppError("Bad Request Error");
    }

    const { _id } = res.locals.user;
    const unlikedCard = await cardModel.findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: _id,
        },
      },
      { new: true, runValidators: true }
    );

    if (!unlikedCard) {
      throw new AppError("Not Found Error");
    }

    res.status(200).send({
      createdAt: unlikedCard.createdAt,
      likes: unlikedCard.likes,
      link: unlikedCard.link,
      name: unlikedCard.name,
      owner: unlikedCard.owner,
    });
  } catch (err) {
    if (err instanceof AppError) {
      switch (err.name) {
        case "Bad Request Error":
          res.status(400).send({ message: "Не корректно переданы данные" });
          break;
        case "Not Found Error":
          res.status(404).send({ message: "Карточка с таким ID не найдена" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
    } else if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "Не корректно переданы данные" });
    } else {
      res.status(500).send({ message: "ошибка на сервере" });
    }
  }
};
