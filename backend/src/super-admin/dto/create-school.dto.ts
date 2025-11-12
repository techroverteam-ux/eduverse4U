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
  @IsString()
  principalQualification?: string;

  @IsOptional()
  @IsString()
  principalExperience?: string;

  @IsOptional()
  @IsString()
  adminName?: string;

  @IsOptional()
  @IsEmail()
  adminEmail?: string;

  @IsOptional()
  @IsString()
  adminPhone?: string;

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
  district?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  schoolType?: string;

  @IsOptional()
  @IsString()
  board?: string;

  @IsOptional()
  @IsString()
  establishedYear?: string;

  @IsOptional()
  @IsString()
  affiliationNumber?: string;

  @IsOptional()
  @IsArray()
  mediumOfInstruction?: string[];

  @IsOptional()
  @IsArray()
  classesOffered?: string[];

  @IsOptional()
  @IsNumber()
  totalStudents?: number;

  @IsOptional()
  @IsNumber()
  totalTeachers?: number;

  @IsOptional()
  @IsNumber()
  totalStaff?: number;

  @IsOptional()
  @IsNumber()
  totalClassrooms?: number;

  @IsOptional()
  @IsBoolean()
  hasLibrary?: boolean;

  @IsOptional()
  @IsBoolean()
  hasLaboratory?: boolean;

  @IsOptional()
  @IsBoolean()
  hasComputerLab?: boolean;

  @IsOptional()
  @IsBoolean()
  hasPlayground?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAuditorium?: boolean;

  @IsOptional()
  @IsBoolean()
  hasMedicalRoom?: boolean;

  @IsOptional()
  @IsBoolean()
  hasCanteen?: boolean;

  @IsOptional()
  @IsBoolean()
  hasTransport?: boolean;

  @IsString()
  selectedPackage: string;

  @IsOptional()
  @IsNumber()
  establishmentYear?: number;

  @IsOptional()
  @IsArray()
  branches?: any[];
}