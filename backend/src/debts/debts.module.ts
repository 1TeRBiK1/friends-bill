import { Module } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { DebtsController } from './debts.controller';
import { Debts, DebtsSchema } from './debts.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersSchema } from 'src/users/users.schema';
import { UsersModule } from 'src/users/users.module';
import { ReturnDebts, ReturnDebtsSchema } from './returnDebts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Debts.name, schema: DebtsSchema },
      { name: User.name, schema: UsersSchema },
      { name: ReturnDebts.name, schema: ReturnDebtsSchema },
    ]),
    UsersModule,
  ],
  controllers: [DebtsController],
  providers: [DebtsService],
  exports: [DebtsService],
})
export class DebtsModule {}
