import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity('doctor_profiles')
export class DoctorProfileEntity {
  @PrimaryGeneratedColumn()
  profileId!: number;

  @Column({ nullable: true })
  bio!: string;

  @Column({ nullable: true })
  consultationFee!: number;

  @Column({ nullable: true })
  degrees!: string;

  @OneToOne(() => DoctorEntity, (doctor) => doctor.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  doctor!: DoctorEntity;
}
