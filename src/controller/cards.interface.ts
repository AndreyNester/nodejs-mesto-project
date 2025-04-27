import { ICard } from "model/card.interface";

interface IGetCard extends ICard {
  id: string;
}
type TGetCardResponse = IGetCard[];

interface ICreateCardRequest extends Partial<Pick<ICard, "name" | "link">> {}
interface ICreateCardResponse extends ICard {
  id: string;
}

export type {
  IGetCard,
  TGetCardResponse,
  ICreateCardRequest,
  ICreateCardResponse,
};
