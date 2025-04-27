import { RequestHandler } from "express";
import { ICard } from "../model/card.interface";
import cardModel from "../model/card";
import userModel from "../model/user";
import { IAuthContext } from "app";

interface IGetCard extends ICard {
  id: string;
}
type TGetCardResponse = IGetCard[];

interface ICreateCardRequest extends Partial<Pick<ICard, "name" | "link">> {}
interface ICreateCardResponse extends ICard {
  id: string;
}

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

export const deleteCard: RequestHandler = (req, res) => {
  res.status(200).send("delete card");
};
