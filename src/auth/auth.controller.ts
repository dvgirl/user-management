// src/auth/auth.controller.ts
import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}


@Post('register')
async register(@Body() dto: RegisterDto) {
try {
const user = await this.authService.register(dto);
return { data: user };
} catch (err) {
throw new HttpException(err.message || 'Registration failed', HttpStatus.BAD_REQUEST);
}
}


@Post('login')
async login(@Body() dto: LoginDto) {
const user = await this.authService.validateUser(dto.email, dto.password);
if (!user) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
return this.authService.login(user);
}
}