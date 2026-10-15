import { PaidPatientEntity } from 'src/PaidPatient/paidpatient.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @OneToOne(
    () => PaidPatientEntity,
    (patient: PaidPatientEntity) => patient.transaction,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'patientId' })
  user: PaidPatientEntity;
}
