import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import {
  CreateTransactionDto,
  UpdateTransactionStatusDto,
} from './transactions.dto';
import { PaidPatientEntity } from 'src/PaidPatient/paidpatient.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(PaidPatientEntity)
    private readonly paidpatientRepository: Repository<PaidPatientEntity>,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const patient = await this.paidpatientRepository.findOne({
      where: { patientId: dto.user_id },
    });
    if (!patient) {
      throw new NotFoundException(`User with ID ${dto.user_id} does not exist`);
    }

    // Query via relation property
    const existing = await this.transactionRepository.findOne({
      where: { user: { patientId: dto.user_id } },
    });
    if (existing) {
      throw new ConflictException(
        `Transaction already exists for user ID ${dto.user_id}`,
      );
    }

    // Attach the patient relation directly
    const transaction = this.transactionRepository.create({
      status: dto.status,
      amount: dto.amount,
      user: patient,
    });

    return this.transactionRepository.save(transaction);
  }

  async updateStatus(
    order_id: number,
    dto: UpdateTransactionStatusDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { order_id },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with Order ID ${order_id} not found`,
      );
    }

    transaction.status = dto.status;
    return this.transactionRepository.save(transaction);
  }

  async getAllTransactions() {
    const transactions = await this.transactionRepository.find({
      relations: {
        user: true,
      },
    });

    return transactions.map((t) => ({
      order_id: t.order_id,
      user_name: t.user ? t.user.fullName : null,
      user_email: t.user ? t.user.email : null,
      status: t.status,
      date: t.date,
      amount: t.amount,
    }));
  }
}
