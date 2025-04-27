import { RequestHandler } from "express";
import { ICard } from "../model/card.interface";
import cardModel from "../model/card";
import userModel from "../model/user";
import { IAuthContext } from "app";

interface IGetCard extends ICard {
  id: string;
}
type TGetCardResponse = IGetCard[];

interface ICreateCardRequest extends Pick<ICard, "name" | "link"> {}
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
  /*ICreateCardResponse*/ string,
  ICreateCardRequest,
  unknown,
  IAuthContext
> = async (req, res) => {
  try {
    const { link, name } = req.body;
    const { user } = res.locals;
    if (!(name && link)) throw new Error("не все параматры переланы");

    const authedUser = await userModel.findById(user._id);
    if (!authedUser?._id) throw new Error("Нет аторизации");

    const createdCard = await cardModel.create({
      name,
      link,
      owner: authedUser._id,
      createdAt: Date.now(),
    });

    console.log(createdCard);
    res.status(200).send("hella");
  } catch (err) {
    console.log(err);

    res.status(500).send("все плохл");
  }
};

export const deleteCard: RequestHandler = (req, res) => {
  res.status(200).send("delete card");
};
