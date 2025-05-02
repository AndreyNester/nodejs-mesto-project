import { IUser } from "../model/user";

interface ICreateuserResponse extends Omit<IUser, "password"> {
  _id: string;
}
interface ICreateuserRequest extends IUser {}

interface IGetUserByIdResponse extends Omit<IUser, "password"> {
  _id: string;
}

interface IGetUsersResItem extends Omit<IUser, "password"> {
  _id: string;
}
type TGetUsersResponse = IGetUsersResItem[];

interface IUpdateUserRequest extends Partial<Pick<IUser, "name" | "about">> {}
interface IUpdateUserResponse extends Omit<IUser, "password"> {
  _id: string;
}

interface IUpdateAvatarRequest extends Partial<Pick<IUser, "avatar">> {}
interface IUpdateAvatarResponse extends Omit<IUser, "password"> {
  _id: string;
}

export type {
  ICreateuserResponse,
  ICreateuserRequest,
  IGetUserByIdResponse,
  TGetUsersResponse,
  IGetUsersResItem,
  IUpdateUserRequest,
  IUpdateUserResponse,
  IUpdateAvatarRequest,
  IUpdateAvatarResponse,
};
