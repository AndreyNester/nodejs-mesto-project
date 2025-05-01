/* eslint-disable no-console */
import { RequestHandler } from "express";
import mongoose from "mongoose";
import IAuthContext from "../types";
import cardModel from "../model/card";
import userModel from "../model/user";
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
    console.error(err);
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
    const { link, name } = req.body;
    if (!(link && name)) {
      throw new AppError("Bad Request Error");
    }

    const { _id } = res.locals.user;
    if (!mongoose.isValidObjectId(_id)) throw new AppError("Auth Error");
    const authUser = await userModel.findById(_id);
    if (!authUser?._id) throw new AppError("Not Found Error");

    const { createdAt, likes, id, owner } = await cardModel.create({
      name,
      owner: authUser._id,
      link,
    });

    res.status(201).send({
      createdAt,
      id,
      likes,
      link,
      name,
      owner,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        case "Auth Error":
          res.status(401).send({ message: "Нет авторизации" });
          break;
        case "Bad Request Error":
          res.status(400).send({ message: "Не все параметры переданы" });
          break;
        case "Not Found Error":
          res
            .status(404)
            .send({ message: "Человека с таким ID не существует" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
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
    if (!id) throw new AppError("Bad Request Error");
    if (!mongoose.isValidObjectId(id)) {
      throw new AppError("Not Found Error");
    }
    const deletedCard = await cardModel.findByIdAndDelete(id);
    if (!deletedCard) {
      throw new AppError("Not Found Error");
    }
    res.status(200).send({
      message: "Карточка успешно удалена",
    });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        case "Bad Request Error":
          res.status(400).send({ message: "Не передат ID" });
          break;
        case "Not Found Error":
          res.status(404).send({ message: "Карточка с таким ID не найдена" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
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

    if (!cardId) throw new Error("Не переда ID карточки");
    if (!mongoose.isValidObjectId(cardId)) {
      throw new AppError("Not Found Error");
    }

    const { _id } = res.locals.user;
    if (!mongoose.isValidObjectId(_id)) {
      throw new AppError("Auth Error");
    }
    const likedCard = await cardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true }
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
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        case "Not Found Error":
          res.status(404).send({ message: "Карточка с таким ID не найдена" });
          break;
        case "Auth Error":
          res.status(401).send({ message: "Нет авторизации" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
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

    if (!cardId) throw new Error("Не переда ID карточки");
    if (!mongoose.isValidObjectId(cardId)) {
      throw new AppError("Not Found Error");
    }

    const { _id } = res.locals.user;
    if (!mongoose.isValidObjectId(_id)) {
      throw new AppError("Auth Error");
    }
    const unlikedCard = await cardModel.findByIdAndUpdate(
      cardId,
      {
        $pull: {
          likes: _id,
        },
      },
      { new: true }
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
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        case "Not Found Error":
          res.status(404).send({ message: "Карточка с таким ID не найдена" });
          break;
        case "Auth Error":
          res.status(401).send({ message: "Нет авторизации" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
    } else {
      res.status(500).send({ message: "ошибка на сервере" });
    }
  }
};
