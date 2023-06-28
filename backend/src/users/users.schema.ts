import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Deptor } from 'src/Types/deptor';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  creditors: Deptor[]
}

const UsersSchema = SchemaFactory.createForClass(Users);

UsersSchema.pre('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});

export { UsersSchema };
