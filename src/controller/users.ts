/* eslint-disable no-console */
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
import AppError from "../config/AppError";

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
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
    } else {
      res.status(500).send({ message: "Ошибка на сервере" });
    }
  }
};

export const getUserById: RequestHandler<
  { id?: string },
  IGetUserByIdResponse | { message: string }
> = async (req, res) => {
  const { id: IdInParam } = req.params;
  try {
    if (!IdInParam) throw new AppError("Bad Request Error");
    if (!mongoose.isValidObjectId(IdInParam)) {
      throw new AppError("Not Found Error");
    }
    const user = await userModel.findById(IdInParam);
    if (!user) throw new AppError("Not Found Error");
    const { about, avatar, name, _id } = user;
    res.status(200).send({
      about,
      avatar,
      name,
      _id: _id.toString(),
    });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        case "Bad Request Error":
          res.status(400).send({ message: "Не корректно переданы данные" });
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
    if (!(req.body.about && req.body.avatar && req.body.name)) {
      throw new AppError("Bad Request Error");
    }
    const { _id, about, avatar, name } = await userModel.create({
      ...req.body,
    });

    res.status(201).send({
      about,
      avatar,
      name,
      _id: _id.toString(),
    });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        case "Bad Request Error":
          res.status(400).send({ message: "Не корректно переданы данные" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
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
    if (!(about && name)) {
      throw new AppError("Bad Request Error");
    }

    const { _id } = res.locals.user;
    if (!(_id && mongoose.isValidObjectId(_id))) {
      throw new AppError("Auth Error");
    }
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
    if (!updatedUser) throw new AppError("Not Found Error");
    res.status(200).send({
      about: updatedUser.about,
      avatar: updatedUser.avatar,
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        case "Auth Error":
          res.status(401).send({ message: "Ошибка авторизации" });
          break;
        case "Bad Request Error":
          res.status(400).send({ message: "Не корректно переданы данные" });
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

    if (!avatar) throw new AppError("Bad Request Error");

    const { _id } = res.locals.user;
    if (!(_id && mongoose.isValidObjectId(_id))) {
      throw new AppError("Auth Error");
    }
    const userWithUpdateddAvatar = await userModel.findByIdAndUpdate(
      _id,
      { $set: { avatar } },
      { new: true }
    );

    if (!userWithUpdateddAvatar) {
      throw new AppError("Not Found Error");
    }

    res.status(200).send({
      about: userWithUpdateddAvatar.about,
      avatar: userWithUpdateddAvatar.avatar,
      _id: userWithUpdateddAvatar._id.toString(),
      name: userWithUpdateddAvatar.name,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof AppError) {
      switch (err.name) {
        case "Auth Error":
          res.status(401).send({ message: "Ошибка авторизации" });
          break;
        case "Bad Request Error":
          res.status(400).send({ message: "Не корректно переданы данные" });
          break;
        case "Not Found Error":
          res.status(404).send({ message: "Не корректно переданы данные" });
          break;
        default:
          res.status(500).send({ message: "Ошибка на сервере" });
      }
    } else {
      res.status(500).send({ message: "Ошибка на сервере" });
    }
  }
};
