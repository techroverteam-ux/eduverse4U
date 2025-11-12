import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: any, tenantId: string) {
    const hashedPassword = await bcrypt.hash(createUserDto.password || 'temp123', 10);
    
    const user = this.userRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
      tenantId,
    });
    
    return this.userRepository.save(user);
  }

  async findAll(tenantId: string, role?: string) {
    const where: any = { tenantId, isActive: true };
    if (role) where.role = role;
    
    return this.userRepository.find({ where });
  }

  async findOne(id: string, tenantId: string) {
    return this.userRepository.findOne({
      where: { id, tenantId },
    });
  }

  async update(id: string, updateUserDto: any, tenantId: string) {
    if (updateUserDto.password) {
      updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateUserDto.password;
    }
    
    await this.userRepository.update({ id, tenantId }, updateUserDto);
    return this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string) {
    return this.userRepository.update({ id, tenantId }, { isActive: false });
  }
}