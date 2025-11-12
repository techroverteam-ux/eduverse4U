import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Tenant } from '../common/entities/tenant.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string, subdomain: string) {
    console.log('Login attempt - subdomain:', subdomain);
    const tenant = await this.tenantRepository.findOne({ where: { subdomain } });
    console.log('Tenant found:', tenant);
    if (!tenant) throw new UnauthorizedException('Invalid tenant');

    const user = await this.userRepository.findOne({
      where: { email, tenantId: tenant.id },
      relations: ['tenant'],
    });

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role,
      tenantId: user.tenantId 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenant: user.tenant,
      },
    };
  }

  async register(tenantData: any, adminData: any) {
    const tenant = this.tenantRepository.create(tenantData);
    const savedTenant = await this.tenantRepository.save(tenant) as unknown as Tenant;

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = this.userRepository.create({
      ...adminData,
      passwordHash: hashedPassword,
      role: 'admin',
      tenantId: savedTenant.id,
    });

    await this.userRepository.save(admin);
    return { message: 'School registered successfully' };
  }
}