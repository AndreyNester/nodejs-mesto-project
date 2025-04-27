import { RequestHandler, Request, Response } from "express";
import userModel from "../model/user";
import {
  ICreateuserRequest,
  ICreateuserResponse,
  TGetUsersResponse,
  IGetUserByIdResponse,
  IGetUsersResItem,
} from "./users.interface";

export const getUsers: RequestHandler<
  unknown,
  TGetUsersResponse | { message: string }
> = async (_req, res) => {
  try {
    const users = await userModel.find({});
    const preparedResponse: TGetUsersResponse = users.map<IGetUsersResItem>(
      ({ about, avatar, id, name }) => ({ about, avatar, id, name })
    );
    res.status(200).send(preparedResponse);
  } catch (err) {
    res.status(500).send({ message: "Что то пошло не так =(" });
  }
};

export const getUserById: RequestHandler<
  { id?: string },
  IGetUserByIdResponse | { message: string }
> = async (req, res) => {
  const { id: IdInParam } = req.params;
  try {
    if (!IdInParam) throw new Error("Нет ID");
    const user = await userModel.findById(IdInParam);
    if (!user) throw new Error("Нет такого пользователя");
    const { about, avatar, name, id } = user;
    res.status(200).send({ about, avatar, name, id });
  } catch (err) {
    res.status(500).send({
      message: "Что то пошло не так =(",
    });
  }
};

export const createUser: RequestHandler<
  unknown,
  ICreateuserResponse | { message: string },
  ICreateuserRequest
> = async (req, res) => {
  try {
    const { id, about, avatar, name } = await userModel.create({
      ...req.body,
    });

    res.status(201).send({
      about,
      avatar,
      name,
      id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Что то пошло не так =(" });
  }
};
