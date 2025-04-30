import { IUser } from "../model/user";

interface ICreateuserResponse extends IUser {
  _id: string;
}
interface ICreateuserRequest extends IUser {}

interface IGetUserByIdResponse extends IUser {
  _id: string;
}

interface IGetUsersResItem extends IUser {
  _id: string;
}
type TGetUsersResponse = IGetUsersResItem[];

interface IUpdateUserRequest extends Partial<Pick<IUser, "name" | "about">> {}
interface IUpdateUserResponse extends IUser {
  _id: string;
}

interface IUpdateAvatarRequest extends Partial<Pick<IUser, "avatar">> {}
interface IUpdateAvatarResponse extends IUser {
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
