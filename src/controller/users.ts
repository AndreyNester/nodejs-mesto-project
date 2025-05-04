import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import mongoose from "mongoose";
import IAuthContext from "../types";
import userModel from "../model/user";
import isDuplicateKeyError from "../utils/isDuplicateKeyError";
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
  ILoginResponse,
  ILoginRequest,
  IGetCurrentUserResponse,
} from "./users.interface";

import BadRequestError from "../config/badRequestError";
import NotFoundError from "../config/notFoundError";
import AuthError from "../config/authError";
import ConflictError from "../config/conflictError";

export const getUsers: RequestHandler<
  unknown,
  TGetUsersResponse | { message: string }
> = async (_req, res, next) => {
  try {
    const users = await userModel.find({});
    const preparedResponse: TGetUsersResponse = users.map<IGetUsersResItem>(
      ({ about, avatar, _id, name, email }) => ({
        about,
        avatar,
        _id: _id.toString(),
        name,
        email,
      })
    );
    res.status(200).send(preparedResponse);
  } catch (err) {
    next(err);
  }
};

export const getUserById: RequestHandler<
  { id: string },
  IGetUserByIdResponse | { message: string }
> = async (req, res, next) => {
  const { id: IdInParam } = req.params;
  try {
    if (!mongoose.isValidObjectId(IdInParam)) {
      throw new BadRequestError("Не корректно переданы данные");
    }
    const user = await userModel.findById(IdInParam);
    if (!user) {
      throw new NotFoundError("Человека с таким ID не существует");
    }
    const { about, avatar, name, _id, email } = user;
    res.status(200).send({
      about,
      avatar,
      name,
      _id: _id.toString(),
      email,
    });
  } catch (err) {
    next(err);
  }
};

export const createUser: RequestHandler<
  unknown,
  ICreateuserResponse | { message: string },
  ICreateuserRequest
> = async (req, res, next) => {
  try {
    const { about, avatar, name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await userModel.create({
      about,
      avatar,
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      about: createdUser.about,
      avatar: createdUser.avatar,
      name: createdUser.name,
      _id: createdUser.id,
      email: createdUser.email,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("Не корректно переданы данные"));
    } else if (isDuplicateKeyError(err)) {
      next(new ConflictError("Такой email уже существует"));
    } else {
      next(err);
    }
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
    const { _id } = res.locals.currentUser;
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
      // Вынуждены проводить лишнюю проверку чтобы сузить тип объекта updatedUser
      throw new NotFoundError("Человека с таким ID не существует");
    }
    res.status(200).send({
      about: updatedUser.about,
      avatar: updatedUser.avatar,
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("не корректно переданы данные"));
    } else {
      next(err);
    }
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
    const { _id } = res.locals.currentUser;
    const userWithUpdateddAvatar = await userModel.findByIdAndUpdate(
      _id,
      { $set: { avatar } },
      { new: true, runValidators: true }
    );
    if (!userWithUpdateddAvatar) {
      // Вынуждены проводить лишнюю проверку чтобы сузить тип объекта updatedUser
      throw new NotFoundError("Пользователь с таким ID не найден");
    }
    res.status(200).send({
      about: userWithUpdateddAvatar.about,
      avatar: userWithUpdateddAvatar.avatar,
      _id: userWithUpdateddAvatar._id.toString(),
      name: userWithUpdateddAvatar.name,
      email: userWithUpdateddAvatar.email,
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError("не корректно переданы данные"));
    } else {
      next(err);
    }
  }
};

export const login: RequestHandler<
  unknown,
  ILoginResponse | { message: string },
  ILoginRequest
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const targetUser = await userModel.findOne({ email }).select("+password");
    if (!targetUser) {
      throw new AuthError("Ошибка авторизации");
    }
    const isPasswordValid = await bcrypt.compare(password, targetUser.password);
    if (!isPasswordValid) {
      throw new AuthError("Ошибка авторизации");
    }
    const payload: IAuthContext["currentUser"] = {
      _id: targetUser._id.toString(),
    };
    const token = jwt.sign(payload, "!I_lova_my_job", { expiresIn: "7d" });
    res.status(200).send({
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser: RequestHandler<
  unknown,
  IGetCurrentUserResponse | { message: string },
  unknown,
  unknown,
  IAuthContext
> = async (_req, res, next) => {
  try {
    const userId = res.locals.currentUser._id;
    const userFromDB = await userModel.findById(userId);
    if (!userFromDB) {
      // Вынуждены проводить лишнюю проверку чтобы сузить тип объекта updatedUser
      throw new NotFoundError("Человека с такиим ID не существует");
    }
    res.status(200).send({
      about: userFromDB.about,
      avatar: userFromDB.avatar,
      email: userFromDB.email,
      name: userFromDB.name,
      _id: userFromDB.id,
    });
  } catch (err) {
    next(err);
  }
};
