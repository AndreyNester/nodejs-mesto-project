import { RequestHandler } from "express";
import cardModel from "../model/card";
import userModel from "../model/user";
import { IAuthContext } from "app";
import {
  ICreateCardRequest,
  ICreateCardResponse,
  TGetCardResponse,
  IGetCard,
  ILikeCardResponse,
  IUnlikeCardResponse,
} from "./cards.interface";
import mongoose from "mongoose";
import { AuthError, BadRequestError, NotFoundError } from "../config";

export const getCards: RequestHandler<
  unknown,
  TGetCardResponse | { message: string }
> = async (_req, res, next) => {
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
    next(err);
  }
};
export const createCard: RequestHandler<
  unknown,
  ICreateCardResponse | { message: string },
  ICreateCardRequest,
  unknown,
  IAuthContext
> = async (req, res, next) => {
  try {
    const { link, name } = req.body;
    if (!(link && name)) {
      throw new BadRequestError("Не все параметры переданы");
    }

    const { _id } = res.locals.user;
    const authUser = await userModel.findById(_id);
    if (!authUser?._id) throw new Error("Нет такого пользователя");

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
    next(err);
  }
};

export const deleteCard: RequestHandler<
  { id?: string },
  {
    message: string;
  }
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Не передан ID");
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundError("Карточки с таким id не существует");
    }
    const deletedCard = await cardModel.findByIdAndDelete(id);
    if (!deletedCard) {
      throw new NotFoundError("Карточки с таким id не существует");
    }
    res.status(200).send({
      message: "Карточка успешно удалена",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const likeCard: RequestHandler<
  { cardId?: string },
  ILikeCardResponse | { message: string },
  unknown,
  unknown,
  IAuthContext
> = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!cardId) throw new Error("Не переда ID карточки");
    if (!mongoose.isValidObjectId(cardId)) {
      throw new NotFoundError("Карточки с таким ID не существует");
    }

    const { _id } = res.locals.user;
    if (!mongoose.isValidObjectId(_id)) {
      throw new AuthError("Нет вторизации");
    }
    const likedCard = await cardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true }
    );
    if (!likedCard) {
      throw new NotFoundError("Карточки с таким ID не существует");
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
    next(err);
  }
};

export const unlikeCard: RequestHandler<
  { cardId?: string },
  IUnlikeCardResponse | { message: string },
  unknown,
  unknown,
  IAuthContext
> = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    if (!cardId) throw new Error("Не переда ID карточки");
    if (!mongoose.isValidObjectId(cardId)) {
      throw new NotFoundError("Карточки с таким ID не существует");
    }

    const { _id } = res.locals.user;
    if (!mongoose.isValidObjectId(_id)) {
      throw new AuthError("Нет вторизации");
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
      throw new NotFoundError("Карточки с таким ID не существует");
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
    next(err);
  }
};
