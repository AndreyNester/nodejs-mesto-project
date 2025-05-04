import { Joi } from "celebrate";
import { ICreateuserRequest, ILoginRequest } from "./users.interface";

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
  }),
};
