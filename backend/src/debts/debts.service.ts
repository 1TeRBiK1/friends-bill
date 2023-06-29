import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Debts, DebtsDocument } from './debts.schema';
import mongoose, { Model, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersDocument } from 'src/users/users.schema';
import { ReturnDebtDto } from './dto/return-debt.dto';
import { ReturnDebts, ReturnDebtsDocument } from './returnDebts.schema';

@Injectable()
export class DebtsService {
  constructor(
    @InjectModel(Debts.name) private debtsModel: Model<DebtsDocument>,
    @InjectModel(ReturnDebts.name)
    private returnDebtsModel: Model<ReturnDebtsDocument>,
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}

  async create(createDebtDto: CreateDebtDto): Promise<Debts> {
    // Сохраняем транзацию
    try {
      const createdDebt = new this.debtsModel(createDebtDto);
      const savedDebt = await createdDebt.save();

      // Находим по транзакции кредитора
      const creditor = savedDebt.creditor;
      const creditorFromDB = await this.usersModel
        .findOne({ name: creditor })
        .exec();

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
      }
      return savedDebt;
    } catch (e) {
      return e;
    }
  }

  async findAll(): Promise<Debts[]> {
    return this.debtsModel.find().sort({ _id: -1 }).limit(30).exec();
  }

  async remove(id: string): Promise<Debts> {
    try {
      const debtFromDB = await this.debtsModel.findById(
        new mongoose.Types.ObjectId(id),
      );
      // Находим по транзакции кредитора
      const creditor = debtFromDB.creditor;
      const creditorFromDB = await this.usersModel
        .findOne({ name: creditor })
        .exec();

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
      }
      return this.debtsModel
        .findByIdAndRemove(new mongoose.Types.ObjectId(id))
        .exec();
    } catch (e) {
      return e;
    }
  }

  async createReturnDebt(returnDebtDto: ReturnDebtDto): Promise<ReturnDebts> {
    // Сохраняем транзацию
    try {
      const createdReturnDebt = new this.returnDebtsModel(returnDebtDto);
      const savedReturnDebt = await createdReturnDebt.save();

      // Находим по транзакции должника
      const debtor = savedReturnDebt.debtor;
      const debtorFromDB = await this.usersModel
        .findOne({ name: debtor })
        .exec();

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
      }
      return savedReturnDebt;
    } catch (e) {
      return e;
    }
  }

  async findAllReturn(): Promise<ReturnDebts[]> {
    return this.returnDebtsModel.find().sort({ _id: -1 }).limit(30).exec();
  }

  async removeReturnDebt(id: string): Promise<ReturnDebts> {
    // Сохраняем транзацию
    try {
      const returnDebtFromDB = await this.returnDebtsModel.findById(
        new mongoose.Types.ObjectId(id),
      );

      // Находим по транзакции должника
      const debtor = returnDebtFromDB.debtor;
      const debtorFromDB = await this.usersModel
        .findOne({ name: debtor })
        .exec();

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
      }
      return this.returnDebtsModel
        .findByIdAndRemove(new mongoose.Types.ObjectId(id))
        .exec();
    } catch (e) {
      return e;
    }
  }
}
