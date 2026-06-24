import { Module } from '@nestjs/common';
import { PaidPatientController } from './paidpatient.controller';
import { PaidPatientService } from './paidpatient.service';

@Module({
  controllers: [PaidPatientController],
  providers: [PaidPatientService],
})
export class PaidPatientModule {}