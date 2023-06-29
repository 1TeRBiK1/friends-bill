import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Deptor } from 'src/Types/deptor';

export type ReturnDebtsDocument = HydratedDocument<ReturnDebts>;

@Schema()
export class ReturnDebts {
  @Prop({ required: true })
  debtor: string;

  @Prop({ required: true })
  creditors: Deptor[];

  @Prop({ required: true })
  date: Date;
}

const ReturnDebtsSchema = SchemaFactory.createForClass(ReturnDebts);

ReturnDebtsSchema.pre('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});

export { ReturnDebtsSchema };
