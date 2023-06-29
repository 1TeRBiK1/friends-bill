import { Deptor } from 'src/Types/deptor';

export class CreateDebtDto {
  creditor: string;
  debtors: Deptor[];
  amount: number;
  date: Date;
  description: string;
}
