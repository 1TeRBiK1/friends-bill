import { Deptor } from "src/Types/deptor";

export class Debt {
  id: number;
  creditor: string;
  debtors: Deptor[];
  amount: number;
  date: Date;
  description: string;
  isDebt: boolean;
}
