import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Debts, DebtsDocument } from './debts.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersDocument } from 'src/users/users.schema';

@Injectable()
export class DebtsService {
  constructor(
    @InjectModel(Debts.name) private debtsModel: Model<DebtsDocument>,
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}

  async create(createDebtDto: CreateDebtDto): Promise<Debts> {
    // Сохраняем транзацию
    try {
      const createdDebt = new this.debtsModel(createDebtDto);
      const savedDebt = await createdDebt.save();

      console.log(savedDebt);

      // Находим по транзакции кредитора
      const creditor = savedDebt.creditor;
      const creditorFromDB = await this.usersModel
        .findOne({ name: creditor })
        .exec();

      console.log(creditorFromDB);

      for (const debtor of savedDebt.debtors) {
        // Обновление состояния долга у должников
        const debtorFromDB = await this.usersModel
          .findOne({ name: debtor.name })
          .exec();
        const indexCreditor = debtorFromDB.creditors.findIndex(
          (c) => c.name === creditorFromDB.name,
        );
        const pathCreditor = `creditors.${indexCreditor}.amount`;
        await this.usersModel
          .findByIdAndUpdate(
            debtorFromDB._id,
            { $set: { [pathCreditor]: debtor.amount } }, // Увеличить сумму долга должника на заданную сумму
          )
          .exec();

        // Обновление состояния долга у кредитора

        const indexDebtor = creditorFromDB.creditors.findIndex(
          (c) => c.name === debtor.name,
        );
        const pathDebt = `creditors.${indexDebtor}.amount`;
        await this.usersModel
          .findByIdAndUpdate(
            creditorFromDB._id,
            { $inc: { [pathDebt]: -debtor.amount } }, // Увеличить сумму долга должника на заданную сумму
          )
          .exec();

        console.log(debtor, pathCreditor, pathDebt, debtorFromDB);
      }
      return savedDebt;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async findAll(): Promise<Debts[]> {
    return this.debtsModel.find().exec();
  }

  remove(id: number): Promise<Debts> {
    return this.debtsModel.findByIdAndRemove(id).exec();
  }
}
