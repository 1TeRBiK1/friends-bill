import { Deptor } from 'src/Types/deptor';

export class ReturnDebtDto {
  debtor: string;
  creditors: Deptor[];
  date: Date;
}
