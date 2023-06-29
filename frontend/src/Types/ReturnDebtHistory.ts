import { IDeptor } from "./Deptor";

export interface IReturnDebtHistory {
  _id: number;
  debtor: string;
  creditors: IDeptor[];
  date: Date;
}
