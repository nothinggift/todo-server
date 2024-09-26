import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.user({ email });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginUserDto) {
    console.log(loginDto);
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterUserDto) {
    const { email, password } = registerDto;
    const existingUser = await this.usersService.user({ email });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.usersService.createUser({ email, password });
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
