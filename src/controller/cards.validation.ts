import { Joi } from "celebrate";
import { ICreateCardRequest } from "./cards.interface";

type TApiPart = "body" | "params" | "headers" | "query";
interface ISchema extends Partial<Record<TApiPart, Joi.ObjectSchema<any>>> {}

export const createCardValidationSchema: ISchema = {
  body: Joi.object<ICreateCardRequest>().keys({
    link: Joi.string().required().uri(),
    name: Joi.string().required().min(3).max(30),
  }),
};

export const deleteCardValidationSchema: ISchema = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

export const likeCardValidationSchema: ISchema = {
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
};

export const unlikeCardValidationSchema: ISchema = {
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
};
