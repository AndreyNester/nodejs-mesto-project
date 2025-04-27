import { RequestHandler } from "express";
import userModel, { IUser } from "../model/user";
import {
  ICreateuserRequest,
  ICreateuserResponse,
  TGetUsersResponse,
  IGetUserByIdResponse,
  IGetUsersResItem,
  IUpdateUserRequest,
  IUpdateUserResponse,
  IUpdateAvatarRequest,
  IUpdateAvatarResponse,
} from "./users.interface";
import { IAuthContext } from "app";

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

export const updateUser: RequestHandler<
  unknown,
  IUpdateUserResponse | { message: string },
  IUpdateUserRequest,
  unknown,
  IAuthContext
> = async (req, res) => {
  try {
    const { name, about } = req.body;
    if (!(about && name)) throw new Error("Не все параметры переданы");

    const { _id } = res.locals.user;
    const updatedUser = await userModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          about,
          name,
        },
      },
      { new: true }
    );
    if (!updatedUser) throw new Error("Нет такого челоека");
    res.status(200).send({
      about: updatedUser.about,
      avatar: updatedUser.avatar,
      id: updatedUser.id,
      name: updatedUser.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Что-то пошло не так =(",
    });
  }
};

export const updateAvatar: RequestHandler<
  unknown,
  IUpdateAvatarResponse | { message: string },
  IUpdateAvatarRequest,
  unknown,
  IAuthContext
> = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) throw new Error("Не переданы все параметры");

    const { _id } = res.locals.user;
    const userWithUpdateddAvatar = await userModel.findByIdAndUpdate(
      _id,
      { $set: { avatar } },
      { new: true }
    );

    if (!userWithUpdateddAvatar) throw new Error("Нет такого пользователя");

    res.status(200).send({
      about: userWithUpdateddAvatar.about,
      avatar: userWithUpdateddAvatar.avatar,
      id: userWithUpdateddAvatar.id,
      name: userWithUpdateddAvatar.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Что-то пошло не так =(",
    });
  }
};
