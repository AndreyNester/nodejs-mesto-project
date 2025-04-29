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
import { NotFoundError, BadRequestError } from "../config";

export const getUsers: RequestHandler<
  unknown,
  TGetUsersResponse | { message: string }
> = async (_req, res, next) => {
  try {
    const users = await userModel.find({});
    const preparedResponse: TGetUsersResponse = users.map<IGetUsersResItem>(
      ({ about, avatar, id, name }) => ({ about, avatar, id, name })
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
    const user = await userModel.findById(IdInParam);
    if (!user) throw new NotFoundError("Нет такого пользователя");
    const { about, avatar, name, id } = user;
    res.status(200).send({ about, avatar, name, id });
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
    if (!(about && name))
      throw new BadRequestError("Не все параметры переданы");

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
    if (!updatedUser) throw new NotFoundError("Нет такого челоека");
    res.status(200).send({
      about: updatedUser.about,
      avatar: updatedUser.avatar,
      id: updatedUser.id,
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
      id: userWithUpdateddAvatar.id,
      name: userWithUpdateddAvatar.name,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
