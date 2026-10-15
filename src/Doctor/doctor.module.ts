import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { DoctorEntity } from './doctor.entity';
import { DoctorProfileEntity } from './doctor-profile.entity';
import { AppointmentEntity } from './appointment.entity';

import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { jwtConstants } from './auth/doctorConstants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorEntity,
      DoctorProfileEntity,
      AppointmentEntity,
    ]),

    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],

  controllers: [DoctorController],

  providers: [DoctorService],

  exports: [DoctorService, TypeOrmModule, JwtModule],
})
export class DoctorModule {}
