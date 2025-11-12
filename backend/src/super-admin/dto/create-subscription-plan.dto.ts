import { IsString, IsNumber, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsNumber()
  monthlyPrice: number;

  @IsNumber()
  yearlyPrice: number;

  @IsNumber()
  maxStudents: number;

  @IsNumber()
  maxBranches: number;

  @IsArray()
  features: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}