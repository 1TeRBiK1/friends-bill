import { IDeptor } from "./Deptor";

export interface IDebtHistory {
  _id: number;
  creditor: string;
  debtors: IDeptor[];
  amount: number;
  date: Date;
  description: string;
}
