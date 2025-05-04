import { Joi } from "celebrate";
import {
  ICreateuserRequest,
  ILoginRequest,
  IUpdateAvatarRequest,
  IUpdateUserRequest,
} from "./users.interface";

type TApiPart = "body" | "params" | "headers" | "query";
interface ISchema extends Partial<Record<TApiPart, Joi.ObjectSchema<any>>> {}

export const createUserValidationSchema: ISchema = {
  body: Joi.object<ICreateuserRequest>({
    password: Joi.string().min(6).required(),

    avatar: Joi.string().uri().optional(),
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().optional(),
  }).unknown(true),
};

export const signInValidationSchema: ISchema = {
  body: Joi.object<ILoginRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true),
};

export const getUserByIdValidationSchema: ISchema = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

export const updateUserValidationhSchema: ISchema = {
  body: Joi.object<IUpdateUserRequest>().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().optional(),
  }),
};

export const updateAvatarValidationSchema: ISchema = {
  body: Joi.object<IUpdateAvatarRequest>().keys({
    avatar: Joi.string().uri(),
  }),
};
