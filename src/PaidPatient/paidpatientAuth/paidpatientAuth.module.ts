import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // 👈 1. Import JwtModule
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './paidpatientAuth.controller';
import { AuthService } from './paidpatientAuth.service';
import { PaidPatientModule } from 'src/PaidPatient/paidpatient.module';
import { jwtConstants } from './paidpatientConstants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PaidPatientModule,

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('MAIL_PORT', 465),
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class PaidPatientAuthModule {}
