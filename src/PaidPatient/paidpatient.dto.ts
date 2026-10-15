import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class PaidPatientDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[a-zA-Z ]+$/, {
    message: 'Name must not contain special characters',
  })
  username?: string;

  fullName?: string;
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^01[0-9]{9}$/, {
    message: 'Phone number must start with 01 and contain valid digits',
  })
  phone?: string;

  @IsNotEmpty({ message: 'Email address field is required' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/, {
    message: 'Email must be a valid address and use the .com domain',
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @IsNotEmpty()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  otp?: string | null;

  file?: string;

  adminId?: string;

  doctorId: number;
}
export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  password: string;
}

export class loginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class PaidPatientUpdateDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[a-zA-Z ]+$/, {
    message: 'Name must not contain special characters',
  })
  username?: string;

  fullName?: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^01[0-9]{9}$/, {
    message: 'Phone number must start with 01 and contain valid digits',
  })
  phone?: string;

  @IsNotEmpty({ message: 'Email address field is required' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/, {
    message: 'Email must be a valid address and use the .com domain',
  })
  email: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  otp?: string | null;
}
