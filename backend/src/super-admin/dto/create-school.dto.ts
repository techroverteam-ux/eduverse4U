import { IsString, IsEmail, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  schoolName: string;

  @IsString()
  schoolCode: string;

  @IsString()
  subdomain: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  affiliationBoard?: string;

  @IsString()
  principalName: string;

  @IsEmail()
  principalEmail: string;

  @IsOptional()
  @IsString()
  principalPhone?: string;

  @IsOptional()
  @IsEmail()
  adminEmail?: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  schoolType?: string;

  @IsOptional()
  @IsNumber()
  totalStudents?: number;

  @IsOptional()
  @IsNumber()
  totalTeachers?: number;

  @IsOptional()
  @IsNumber()
  establishmentYear?: number;

  @IsString()
  selectedPackage: string;
}