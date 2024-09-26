import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }
}
