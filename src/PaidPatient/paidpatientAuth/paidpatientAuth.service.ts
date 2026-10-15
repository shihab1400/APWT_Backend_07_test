import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { PaidPatientService } from 'src/PaidPatient/paidpatient.service';
import {
  PaidPatientDto,
  loginDTO,
  VerifyOtpDto,
} from 'src/PaidPatient/paidpatient.dto';
import bcrypt from 'bcrypt';
import { PaidPatientEntity } from 'src/PaidPatient/paidpatient.entity';

@Injectable()
export class AuthService {
  constructor(
    private paidpatientService: PaidPatientService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signUp(myobj: PaidPatientDto): Promise<PaidPatientEntity> {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    myobj.otp = generatedOtp;

    const savedUser = await this.paidpatientService.addPaidPatient(myobj);

    await this.mailerService.sendMail({
      to: savedUser.email,
      subject: 'Account Verification OTP',
      text: `Welcome! Your verification code is: ${generatedOtp}`,
    });

    return savedUser;
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string }> {
    const user = await this.paidpatientService.findOne(dto.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isActive) {
      throw new BadRequestException('Account is already activated');
    }

    if (user.otp !== dto.otp) {
      throw new BadRequestException('Invalid OTP code');
    }

    return await this.paidpatientService.updateStatus(user.patientId);
  }

  async signIn(logindata: loginDTO): Promise<{ access_token: string }> {
    const user = await this.paidpatientService.findOne(logindata.email);
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
      sub: user.patientId,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
