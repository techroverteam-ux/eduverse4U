import { Controller, Post, Body } from '@nestjs/common';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post('branches')
  async createBranches(@Body('branches') branches: any[]) {
    return await this.schoolsService.createBranches(branches);
  }
}