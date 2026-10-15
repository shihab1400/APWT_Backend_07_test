import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './doctorAuth.controller';
import { AuthService } from './doctorAuth.service';
import { DoctorModule } from '../doctor.module';
import { jwtConstants } from './doctorConstants';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DoctorModule,

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
export class DoctorAuthModule {}
