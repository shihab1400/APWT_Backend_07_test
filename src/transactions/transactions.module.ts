import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { PaidPatientEntity } from 'src/PaidPatient/paidpatient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, PaidPatientEntity])],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
