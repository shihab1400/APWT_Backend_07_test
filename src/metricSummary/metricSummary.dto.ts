import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMetricSummaryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  change: string;

  @IsNotEmpty()
  @IsString()
  badge: string;
}
