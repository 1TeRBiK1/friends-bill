import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Deptor } from 'src/Types/deptor';

export type DebtsDocument = HydratedDocument<Debts>;

@Schema()
export class Debts {

  @Prop({ required: true})
  debtors: Deptor[];

  @Prop({ required: true })
  creditor: string;
  
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string;
}

const DebtsSchema = SchemaFactory.createForClass(Debts);

DebtsSchema.pre('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});

export { DebtsSchema };
