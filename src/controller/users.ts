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
import { NotFoundError, BadRequestError, AuthError } from "../config";
import mongoose from "mongoose";

export const getUsers: RequestHandler<
  unknown,
  TGetUsersResponse | { message: string }
> = async (_req, res, next) => {
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
    next(err);
  }
};

export const getUserById: RequestHandler<
  { id?: string },
  IGetUserByIdResponse | { message: string }
> = async (req, res, next) => {
  const { id: IdInParam } = req.params;
  try {
    if (!IdInParam) throw new BadRequestError("Нет ID");
    if (!mongoose.isObjectIdOrHexString(IdInParam))
      throw new NotFoundError("Нет такого пользователя");
    const user = await userModel.findById(IdInParam);
    if (!user) throw new NotFoundError("Нет такого пользователя");
    const { about, avatar, name, _id } = user;
    res.status(200).send({ about, avatar, name, _id: _id.toString() });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const createUser: RequestHandler<
  unknown,
  ICreateuserResponse | { message: string },
  ICreateuserRequest
> = async (req, res, next) => {
  try {
    if (!(req.body.about && req.body.avatar && req.body.name))
      throw new BadRequestError("Не все параметры переданы");
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
    next(err);
  }
};

export const updateUser: RequestHandler<
  unknown,
  IUpdateUserResponse | { message: string },
  IUpdateUserRequest,
  unknown,
  IAuthContext
> = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    if (!(about && name)) {
      throw new BadRequestError("Не все параметры переданы");
    }

    const { _id } = res.locals.user;
    if (!(_id && mongoose.isValidObjectId(_id))) {
      throw new AuthError("Нет авторизации");
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
    if (!updatedUser) throw new NotFoundError("Нет такого челоека");
    res.status(200).send({
      about: updatedUser.about,
      avatar: updatedUser.avatar,
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateAvatar: RequestHandler<
  unknown,
  IUpdateAvatarResponse | { message: string },
  IUpdateAvatarRequest,
  unknown,
  IAuthContext
> = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    if (!avatar) throw new BadRequestError("Не переданы все параметры");

    const { _id } = res.locals.user;
    if (!(_id && mongoose.isValidObjectId(_id))) {
      throw new AuthError("нет авторизации");
    }
    const userWithUpdateddAvatar = await userModel.findByIdAndUpdate(
      _id,
      { $set: { avatar } },
      { new: true }
    );

    if (!userWithUpdateddAvatar)
      throw new NotFoundError("Нет такого пользователя");

    res.status(200).send({
      about: userWithUpdateddAvatar.about,
      avatar: userWithUpdateddAvatar.avatar,
      _id: userWithUpdateddAvatar._id.toString(),
      name: userWithUpdateddAvatar.name,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
