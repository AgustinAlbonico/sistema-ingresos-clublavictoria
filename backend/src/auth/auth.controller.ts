import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() input: LoginDto) {
    return await this.authService.login(input);
  }

  @Post('generarPasswordHash')
  async generarPasswordHash(@Body() input: { password: string }) {
    return await this.authService.generarPasswordHash(input.password);
  }
}
