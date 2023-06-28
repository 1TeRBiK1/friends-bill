import { IDeptor } from "./Deptor";

export interface IUser {
  name: string;
  creditors: IDeptor[]
}