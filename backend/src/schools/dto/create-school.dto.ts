import { IsString, IsEmail, IsOptional, IsObject } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  schoolName: string;

  @IsString()
  schoolCode: string;

  @IsOptional()
  @IsString()
  establishedYear?: string;

  @IsOptional()
  @IsString()
  schoolType?: string;

  @IsOptional()
  @IsString()
  board?: string;

  @IsOptional()
  @IsObject()
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  @IsOptional()
  @IsObject()
  contact?: {
    phone: string;
    email: string;
    website?: string;
  };

  @IsOptional()
  @IsObject()
  principal?: {
    name: string;
    phone: string;
    email: string;
  };

  @IsOptional()
  @IsObject()
  admin?: {
    name: string;
    phone: string;
    email: string;
  };

  @IsOptional()
  @IsObject()
  affiliation?: {
    number: string;
    board: string;
  };

  @IsOptional()
  @IsObject()
  logo?: any;
}