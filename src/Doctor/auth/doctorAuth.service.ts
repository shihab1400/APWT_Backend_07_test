import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { DoctorService } from '../doctor.service';
import { DoctorDTO, loginDTO, VerifyOtpDto } from '../doctor.dto';
import * as bcrypt from 'bcrypt';
import { DoctorEntity } from '../doctor.entity';

@Injectable()
export class AuthService {
  constructor(
    private doctorService: DoctorService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signUp(myobj: DoctorDTO): Promise<DoctorEntity> {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    myobj.otp = generatedOtp;

    const savedUser = await this.doctorService.addDoctor(myobj);

    await this.mailerService.sendMail({
      to: savedUser.email,
      subject: 'Doctor Account Verification OTP',
      text: `Welcome Dr. ${savedUser.name}! Your verification code is: ${generatedOtp}`,
    });

    return savedUser;
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string }> {
    const user = await this.doctorService.findOne(dto.email);

    if (!user) {
      throw new BadRequestException('Doctor not found');
    }

    if (user.isActive) {
      throw new BadRequestException('Account is already activated');
    }

    if (user.otp !== dto.otp) {
      throw new BadRequestException('Invalid OTP code');
    }

    return await this.doctorService.updateStatus(user.doctorId);
  }

  async signIn(logindata: loginDTO): Promise<{ access_token: string }> {
    const user = await this.doctorService.findOne(logindata.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account is not validated. Please verify your email using the OTP sent to you.',
      );
    }

    const isMatch: boolean = await bcrypt.compare(
      logindata.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.doctorId,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
