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
    res.status(500).send({ message: "Что-то пошло не так =(" });
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
    if (!(link && name)) throw new Error("Не все параметры переданы");

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
    console.log(err);
    res.status(500).send({
      message: "Что-то пошло не так =(",
    });
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
    if (!id) throw new Error("Не передан ID");
    const deletedCard = await cardModel.findByIdAndDelete(id);
    if (!deletedCard) throw new Error("Такого человека не существует");
    res.status(200).send({
      message: "Карточка успешно удалена",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Что-то пошло не так",
    });
  }
};
export const likeCard: RequestHandler<
  { cardId?: string },
  ILikeCardResponse | { message: string },
  unknown,
  IAuthContext
> = async (req, res) => {
  try {
    const { cardId } = req.params;

    if (!cardId) throw new Error("Не переда ID карточки");

    const { _id } = res.locals.user;
    const likedCard = await cardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: _id } },
      { new: true }
    );
    if (!likedCard) throw new Error("Нет такой карточки");

    res.status(200).send({
      createdAt: likedCard.createdAt,
      id: likedCard.id,
      likes: likedCard.likes,
      link: likedCard.link,
      name: likedCard.name,
      owner: likedCard.owner,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Что-то пошло не так =(" });
  }
};

export const unlikeCard: RequestHandler<
  unknown,
  IUnlikeCardResponse | { message: string },
  unknown,
  { cardId: string },
  IAuthContext
> = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Что-то пошло не так =(" });
  }
};
