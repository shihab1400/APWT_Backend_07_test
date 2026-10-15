import { AdminEntity } from 'src/admin/admin.entity';
import { DoctorEntity } from 'src/Doctor/doctor.entity';
import { Transaction } from 'src/transactions/transactions.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('paidpatient')
export class PaidPatientEntity {
  @PrimaryColumn()
  patientId: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  fullName: string;

  @Column({
    type: 'varchar',
  })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  otp: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  filename: string | null;

  @BeforeInsert()
  generateId() {
    const timerand = String(Date.now()).slice(-4);

    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');

    const month = String(now.getMonth() + 1).padStart(2, '0');

    const year = String(now.getFullYear()).slice(2, 4);

    const rand = String(Math.floor(10 + Math.random() * 90));

    this.patientId = `PP-${timerand}-${day}${month}${year}-${rand}`;
  }

  @ManyToOne(() => AdminEntity, (admin) => admin.paidPatients)
  @JoinColumn({ name: 'adminId' }) // Optional: Explicitly naming the foreign key column 'adminId'
  admin: AdminEntity;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.paidPatients, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'doctorId' })
  doctor: DoctorEntity | null;

  //   @OneToMany(() => ChatMessageEntity, (chat) => chat.paidPatient)
  //   chatMessages: ChatMessageEntity[];

  @OneToOne(() => Transaction, (transaction: Transaction) => transaction.user)
  transaction: Transaction;
}
