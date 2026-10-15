import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
} from './transactions.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() createDto: CreateTransactionDto) {
    return await this.transactionService.createTransaction(createDto);
  }

  @Patch(':order_id/status')
  async updateStatus(
    @Param('order_id', ParseIntPipe) order_id: number,
    @Body() updateDto: UpdateTransactionStatusDto,
  ) {
    return await this.transactionService.updateStatus(order_id, updateDto);
  }

  @Get()
  async findAll() {
    return await this.transactionService.getAllTransactions();
  }
}
