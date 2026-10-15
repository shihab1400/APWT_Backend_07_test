import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  appointmentId!: number;

  @Column()
  patientName!: string;

  @Column()
  appointmentDate!: string;

  @Column({ default: 'Pending' })
  status!: string;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  doctor!: DoctorEntity;
}
