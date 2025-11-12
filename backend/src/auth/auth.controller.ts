import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
    @Headers('x-tenant') subdomain: string,
  ) {
    return this.authService.login(loginDto.email, loginDto.password, subdomain);
  }

  @Post('register')
  async register(@Body() registerDto: {
    schoolName: string;
    subdomain: string;
    adminEmail: string;
    adminPassword: string;
    adminName: string;
    phone: string;
  }) {
    const [firstName, lastName] = registerDto.adminName.split(' ');
    
    return this.authService.register(
      {
        name: registerDto.schoolName,
        subdomain: registerDto.subdomain,
      },
      {
        email: registerDto.adminEmail,
        password: registerDto.adminPassword,
        firstName,
        lastName: lastName || '',
        phone: registerDto.phone,
      }
    );
  }
}