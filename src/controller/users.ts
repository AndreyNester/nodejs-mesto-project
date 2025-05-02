import { RequestHandler } from "express";
import mongoose from "mongoose";
import IAuthContext from "../types";
import userModel from "../model/user";
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

export const getUsers: RequestHandler<
  unknown,
  TGetUsersResponse | { message: string }
> = async (_req, res) => {
  try {
    const users = await userModel.find({});
    const preparedResponse: TGetUsersResponse = users.map<IGetUsersResItem>(
      ({ about, avatar, _id, name }) => ({
        about,
        avatar,
        _id: _id.toString(),
        name,
      })
    );
    res.status(200).send(preparedResponse);
  } catch (err) {
    res.status(500).send({ message: "Ошибка на сервере" });
  }
};

export const getUserById: RequestHandler<
  { id: string },
  IGetUserByIdResponse | { message: string }
> = async (req, res) => {
  const { id: IdInParam } = req.params;
  try {
    if (!mongoose.isValidObjectId(IdInParam)) {
      res.status(400).send({ message: "Не корректно переданы данные" });
      return;
    }
    const user = await userModel.findById(IdInParam);
    if (!user) {
      res.status(404).send({ message: "Человека с таким ID не существует" });
      return;
    }
    const { about, avatar, name, _id } = user;
    res.status(200).send({
      about,
      avatar,
      name,
      _id: _id.toString(),
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "Не корректно переданы данные" });
    } else {
      res.status(500).send({ message: "Ошибка на сервере" });
    }
  }
};

export const createUser: RequestHandler<
  unknown,
  ICreateuserResponse | { message: string },
  ICreateuserRequest
> = async (req, res) => {
  try {
    const { about, avatar, name } = req.body;
    const createdUser = await userModel.create({
      about,
      avatar,
      name,
    });

    res.status(201).send({
      about: createdUser.about,
      avatar: createdUser.avatar,
      name: createdUser.name,
      _id: createdUser.id,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "Не корректно переданы данные" });
    } else {
      res.status(500).send({ message: "Ошибка на сервере" });
    }
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
    const { _id } = res.locals.user;
    const updatedUser = await userModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          about,
          name,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      res.status(404).send({ message: "Человека с таким ID не существует" });
      return;
    }
    res.status(200).send({
      about: updatedUser.about,
      avatar: updatedUser.avatar,
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "не корректно переданы данные" });
    } else {
      res.status(500).send({ message: "Ошибка на сервере" });
    }
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
    const { _id } = res.locals.user;
    const userWithUpdateddAvatar = await userModel.findByIdAndUpdate(
      _id,
      { $set: { avatar } },
      { new: true, runValidators: true }
    );
    if (!userWithUpdateddAvatar) {
      res.status(404).send({ message: "Пользователь с таким ID не найден" });
      return;
    }
    res.status(200).send({
      about: userWithUpdateddAvatar.about,
      avatar: userWithUpdateddAvatar.avatar,
      _id: userWithUpdateddAvatar._id.toString(),
      name: userWithUpdateddAvatar.name,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: "не корректно переданы данные" });
    } else {
      res.status(500).send({ message: "Ошибка на сервере" });
    }
  }
};
