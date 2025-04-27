import { IUser } from "../model/user";

interface ICreateuserResponse extends IUser {
  id: string;
}
interface ICreateuserRequest extends IUser {}

interface IGetUserByIdResponse extends IUser {
  id: string;
}

interface IGetUsersResItem extends IUser {
  id: string;
}
type TGetUsersResponse = IGetUsersResItem[];

interface IUpdateUserRequest extends Partial<Pick<IUser, "name" | "about">> {}
interface IUpdateUserResponse extends IUser {
  id: string;
}

interface IUpdateAvatarRequest extends Partial<Pick<IUser, "avatar">> {}
interface IUpdateAvatarResponse extends IUser {
  id: string;
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
