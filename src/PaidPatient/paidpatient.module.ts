import { Module } from '@nestjs/common';
import { PaidPatientController } from './paidpatient.controller';
import { PaidPatientService } from './paidpatient.service';
import { PaidPatientEntity } from './paidpatient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/admin.entity';
import { DoctorEntity } from 'src/Doctor/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaidPatientEntity, AdminEntity, DoctorEntity]),
  ],
  controllers: [PaidPatientController],
  providers: [PaidPatientService],
  exports: [PaidPatientService], // Export the service to make it available for injection in other modules
})
export class PaidPatientModule {}
