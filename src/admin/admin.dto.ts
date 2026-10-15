import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  Matches,
  //   Length,
  IsOptional,
  IsNumber,
  Min,
  IsEmail,
  IsString,
  IsBoolean,
} from 'class-validator';

export class AdminDTO {
  @IsOptional()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name must contain only alphabets and spaces',
  })
  fullname: string;

  //   @IsNotEmpty()
  //   username: string;

  @IsNotEmpty({ message: 'Email address field is required' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/, {
    message: 'Email must be a valid address and use the .com domain',
  })
  email: string;

  //   @Length(10, 10, { message: 'Length of NID must be 10' })
  //   @Matches(/^\d+$/, { message: 'NID must contain only numeric digits' })
  //   nid?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Phone number cannot be negative' })
  @Transform(({ value }) => Number(value))
  phone: number;

  @IsNotEmpty()
  password: string;

  //   @Transform(({ value }) => {
  //     if (value === 'true' || value === true) return true;
  //     if (value === 'false' || value === false) return false;
  //   })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  otp?: string | null;

  profilePic?: string;
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
