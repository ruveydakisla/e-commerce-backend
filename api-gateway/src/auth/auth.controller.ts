import { LoginDto } from '@my/common';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() lodinDto: LoginDto) {
    return this.authService.login(lodinDto);
  }
}
