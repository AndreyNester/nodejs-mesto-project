import ICard from '../model/card.interface';

export interface IGetCard extends ICard {
  id: string;
}
export type TGetCardResponse = IGetCard[];

export interface ICreateCardRequest
  extends Partial<Pick<ICard, 'name' | 'link'>> {}
export interface ICreateCardResponse extends ICard {
  id: string;
}

export interface ILikeCardResponse extends ICard {
  id: string;
}

export interface IUnlikeCardResponse extends ICard {}
