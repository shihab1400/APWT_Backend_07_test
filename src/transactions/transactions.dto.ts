import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class UpdateTransactionStatusDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}
