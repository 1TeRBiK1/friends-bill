import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ReturnDebtDto } from './dto/return-debt.dto';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @Get()
  findAll() {
    return this.debtsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtsService.remove(+id);
  }

  @Post('return-debt')
  returnDebt(@Body() returnDebtDto: ReturnDebtDto) {
    return this.debtsService.returnDebt(returnDebtDto);
  }

  @Get('return-debt')
  findAllReturn(){
    return this.debtsService.findAllReturn();
  }
}
