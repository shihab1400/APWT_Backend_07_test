import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { DoctorProfileEntity } from './doctor-profile.entity';
import { AppointmentEntity } from './appointment.entity';
import * as bcrypt from 'bcrypt';
import { PaidPatientEntity } from 'src/PaidPatient/paidpatient.entity';

@Entity('doctors')
export class DoctorEntity {
  @PrimaryGeneratedColumn()
  doctorId!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  specialization!: string;

  @Column()
  licenseNumber!: string;

  @Column({ nullable: true })
  profilePic!: string;

  @Column({
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  otp!: string;

  @Column({ default: false })
  isActive!: boolean;

  @BeforeInsert()
  generateOTP() {
    this.otp = Math.floor(100000 + Math.random() * 900000).toString();
  }

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // 1. ONE-TO-ONE RELATIONSHIP: Doctor has one DoctorProfile
  @OneToOne(() => DoctorProfileEntity, (profile) => profile.doctor, {
    cascade: true,
  })
  profile!: DoctorProfileEntity;

  // 2. ONE-TO-MANY RELATIONSHIP: Doctor has many Appointments
  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor)
  appointments!: AppointmentEntity[];

  @OneToMany(() => PaidPatientEntity, (paidPatient) => paidPatient.doctor, {
    nullable: true,
  })
  paidPatients: PaidPatientEntity[];
}
