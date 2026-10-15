import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class DoctorDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  @IsString()
  specialization!: string;

  @IsNotEmpty()
  @IsString()
  licenseNumber!: string;

  profilePic?: string;

  otp?: string;

  isActive?: boolean;
}

export class loginDTO {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  otp!: string;
}

export class UpdateDoctorStatusDto {
  @IsNotEmpty()
  @IsString()
  specialization!: string;
}

export class UpdateDoctorEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  patientName!: string;

  @IsNotEmpty()
  @IsString()
  appointmentDate!: string;
}

export class CreateDoctorProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  consultationFee?: number;

  @IsOptional()
  @IsString()
  degrees?: string;
}
