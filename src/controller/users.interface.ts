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

export type {
  ICreateuserResponse,
  ICreateuserRequest,
  IGetUserByIdResponse,
  TGetUsersResponse,
  IGetUsersResItem,
};
