import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { PaidPatientModule } from './PaidPatient/paidpatient.module';
import { AdminAuthModule } from './admin/adminAuth/adminAuth.module';
import { PaidPatientAuthModule } from './PaidPatient/paidpatientAuth/paidpatientAuth.module';
import { AibotModule } from './aibot/aibot.module';
import { DoctorAuthModule } from './Doctor/auth/doctorAuth.module';
import { DoctorEntity } from './Doctor/doctor.entity';
import { TransactionModule } from './transactions/transactions.module';
import { MetricSummaryModule } from './metricSummary/metricSummary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin123',
      database: 'full_stack_v1',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AdminModule,
    UserModule,
    PaidPatientModule,
    AdminAuthModule,
    PaidPatientAuthModule,
    AibotModule,
    DoctorAuthModule,
    DoctorEntity,
    TransactionModule,
    MetricSummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
