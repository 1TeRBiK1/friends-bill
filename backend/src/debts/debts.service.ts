import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Debts,
  DebtsDocument,
  ReturnDebts,
  ReturnDebtsDocument,
} from './debts.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersDocument } from 'src/users/users.schema';
import { ReturnDebtDto } from './dto/return-debt.dto';

@Injectable()
export class DebtsService {
  constructor(
    @InjectModel(Debts.name) private debtsModel: Model<DebtsDocument>,
    @InjectModel(Debts.name)
    private returnDebtsModel: Model<ReturnDebtsDocument>,
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
            { $inc: { [pathCreditor]: debtor.amount } }, // Увеличить сумму долга должника на заданную сумму
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
    return this.debtsModel.find().sort({ _id: -1 }).limit(30).exec();
  }

  async remove(id: number): Promise<Debts> {
    try {
      const debtFromDB = await this.debtsModel.findById(id);

      // Находим по транзакции кредитора
      const creditor = debtFromDB.creditor;
      const creditorFromDB = await this.usersModel
        .findOne({ name: creditor })
        .exec();

      console.log(creditorFromDB);

      for (const debtor of debtFromDB.debtors) {
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
            { $inc: { [pathCreditor]: -debtor.amount } }, // Уменьшить сумму долга должника на заданную сумму
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
            { $inc: { [pathDebt]: debtor.amount } }, // Уменьшить сумму долга должника на заданную сумму
          )
          .exec();

        console.log(debtor, pathCreditor, pathDebt, debtorFromDB);
      }
      return this.debtsModel.findByIdAndRemove(id).exec();
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async returnDebt(returnDebtDto: ReturnDebtDto): Promise<ReturnDebts> {
    // Сохраняем транзацию
    try {
      const createdReturnDebt = new this.returnDebtsModel(returnDebtDto);
      const savedReturnDebt = await createdReturnDebt.save();

      console.log(savedReturnDebt);

      // Находим по транзакции должника
      const debtor = savedReturnDebt.debtor;
      const debtorFromDB = await this.usersModel
        .findOne({ name: debtor })
        .exec();

      console.log(debtorFromDB);

      for (const creditor of savedReturnDebt.creditors) {
        // Обновление состояния долга у кредиторов
        const creditorFromDB = await this.usersModel
          .findOne({ name: creditor.name })
          .exec();
        const indexDebtor = creditorFromDB.creditors.findIndex(
          (c) => c.name === debtorFromDB.name,
        );
        const pathDebtor = `creditors.${indexDebtor}.amount`;
        await this.usersModel
          .findByIdAndUpdate(
            debtorFromDB._id,
            { $inc: { [pathDebtor]: -creditor.amount } }, // Увеличить сумму долга должника на заданную сумму
          )
          .exec();

        // Обновление состояния долга у кредитора

        const indexCreditor = debtorFromDB.creditors.findIndex(
          (c) => c.name === creditor.name,
        );
        const pathCreditor = `creditors.${indexCreditor}.amount`;
        await this.usersModel
          .findByIdAndUpdate(
            creditorFromDB._id,
            { $inc: { [pathCreditor]: creditor.amount } }, // Увеличить сумму долга должника на заданную сумму
          )
          .exec();

        console.log(debtor, pathCreditor, pathDebtor, debtorFromDB);
      }
      return savedReturnDebt;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async findAllReturn(): Promise<ReturnDebts[]> {
    return this.returnDebtsModel.find().sort({ _id: -1 }).limit(30).exec();
  }

  async removeReturnDebt(id: number): Promise<ReturnDebts> {
    // Сохраняем транзацию
    try {
      const returnDebtFromDB = await this.returnDebtsModel.findById(id);

      // Находим по транзакции должника
      const debtor = returnDebtFromDB.debtor;
      const debtorFromDB = await this.usersModel
        .findOne({ name: debtor })
        .exec();

      console.log(debtorFromDB);

      for (const creditor of returnDebtFromDB.creditors) {
        // Обновление состояния долга у кредиторов
        const creditorFromDB = await this.usersModel
          .findOne({ name: creditor.name })
          .exec();
        const indexDebtor = creditorFromDB.creditors.findIndex(
          (c) => c.name === debtorFromDB.name,
        );
        const pathDebtor = `creditors.${indexDebtor}.amount`;
        await this.usersModel
          .findByIdAndUpdate(
            debtorFromDB._id,
            { $inc: { [pathDebtor]: creditor.amount } }, // Увеличить сумму долга должника на заданную сумму
          )
          .exec();

        // Обновление состояния долга у кредитора

        const indexCreditor = debtorFromDB.creditors.findIndex(
          (c) => c.name === creditor.name,
        );
        const pathCreditor = `creditors.${indexCreditor}.amount`;
        await this.usersModel
          .findByIdAndUpdate(
            creditorFromDB._id,
            { $inc: { [pathCreditor]: -creditor.amount } }, // Увеличить сумму долга должника на заданную сумму
          )
          .exec();

        console.log(debtor, pathCreditor, pathDebtor, debtorFromDB);
      }
      return returnDebtFromDB;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
