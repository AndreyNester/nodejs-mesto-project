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
import BadRequestError from "../config/badRequestError";
import NotFoundError from "../config/notFoundError";
import ForbiddenError from "../config/forbiddenError";

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
    const { name, link } = req.body;
    const { _id } = res.locals.currentUser;

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
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Не корректно переданы данные"));
    } else {
      next(err);
    }
  }
};

export const deleteCard: RequestHandler<
  { id: string },
  {
    message: string;
  },
  unknown,
  unknown,
  IAuthContext
> = async (req, res, next) => {
  try {
    const { id: cardId } = req.params;
    const { _id: curUserId } = res.locals.currentUser;

    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError("Не корректно переданы данные");
    }
    const deletedCard = await cardModel.findById(cardId);
    if (!deletedCard) {
      throw new NotFoundError("Карточка с таким ID не найдена");
    }
    if (deletedCard.owner.toString() !== curUserId) {
      throw new ForbiddenError("У вас нет прав на удаление этой карточки");
    }
    await deletedCard.deleteOne();
    res.status(200).send({
      message: "Карточка успешно удалена",
    });
  } catch (err) {
    next(err);
  }
};
export const likeCard: RequestHandler<
  { cardId: string },
  ILikeCardResponse | { message: string },
  unknown,
  unknown,
  IAuthContext
> = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError("не корректно переданы данные");
    }

    const { _id } = res.locals.currentUser;

    const likedCard = await cardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true, runValidators: true }
    );
    if (!likedCard) {
      throw new NotFoundError("Карточка с таким ID не найдена");
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
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Не корректно передаены данные"));
    } else {
      next(err);
    }
  }
};

export const unlikeCard: RequestHandler<
  { cardId: string },
  IUnlikeCardResponse | { message: string },
  unknown,
  unknown,
  IAuthContext
> = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.isValidObjectId(cardId)) {
      throw new BadRequestError("Не корректно переданы данные");
    }
    const { _id } = res.locals.currentUser;
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
      throw new NotFoundError("Карточка с таким ID не найдена");
    }

    res.status(200).send({
      createdAt: unlikedCard.createdAt,
      likes: unlikedCard.likes,
      link: unlikedCard.link,
      name: unlikedCard.name,
      owner: unlikedCard.owner,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Не корректно переданы данные"));
    } else {
      next(err);
    }
  }
};
